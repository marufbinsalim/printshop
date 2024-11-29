export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          email: string;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          email: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          email?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      raffles: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          start_date: string;
          end_date: string;
          total_tickets: number;
          status: 'draft' | 'active' | 'completed' | 'cancelled';
          winner_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          start_date: string;
          end_date: string;
          total_tickets: number;
          status?: 'draft' | 'active' | 'completed' | 'cancelled';
          winner_id?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          start_date?: string;
          end_date?: string;
          total_tickets?: number;
          status?: 'draft' | 'active' | 'completed' | 'cancelled';
          winner_id?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ticket_pools: {
        Row: {
          id: string;
          raffle_id: string;
          ticket_number: number;
          status: 'available' | 'reserved' | 'purchased' | 'won';
          user_id: string | null;
          purchased_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          raffle_id: string;
          ticket_number: number;
          status?: 'available' | 'reserved' | 'purchased' | 'won';
          user_id?: string | null;
          purchased_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          raffle_id?: string;
          ticket_number?: number;
          status?: 'available' | 'reserved' | 'purchased' | 'won';
          user_id?: string | null;
          purchased_at?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          raffle_id: string;
          amount: number;
          ticket_count: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          raffle_id: string;
          amount: number;
          ticket_count: number;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          raffle_id?: string;
          amount?: number;
          ticket_count?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}