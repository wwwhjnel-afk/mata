import type { Database } from "@/types/database";
import { createBrowserClient } from "@supabase/ssr";

// Validate environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Enhanced client configuration for mobile performance
let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  // Validate environment variables are present
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
      "Missing Supabase environment variables:",
      !SUPABASE_URL ? "NEXT_PUBLIC_SUPABASE_URL" : "",
      !SUPABASE_ANON_KEY ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : ""
    );
    throw new Error("Supabase configuration missing. Please check environment variables.");
  }

  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Reduce auth checks for better performance
      storageKey: 'driver-app-auth',
    },
    global: {
      headers: {
        'x-client-name': 'driver-mobile-app',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10, // Limit realtime events per second
      },
    },
  });

  return client;
}

// Enhanced client with connection recovery and better error handling
export function createClientWithRecovery() {
  try {
    const supabase = createClient();
    
    // Add connection recovery mechanism
    if (typeof window !== 'undefined') {
      // Handle online/offline events gracefully
      const handleOnline = () => {
        console.log('Network restored - refreshing auth state');
        supabase.auth.getSession().catch(console.error);
      };
      
      const handleOffline = () => {
        console.log('Network connection lost - entering offline mode');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Cleanup function for when the client is destroyed
      const originalRemove = supabase.removeChannel;
      supabase.removeChannel = function(channel: any) {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        return originalRemove.call(this, channel);
      };
    }
    
    return supabase;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw error;
  }
}