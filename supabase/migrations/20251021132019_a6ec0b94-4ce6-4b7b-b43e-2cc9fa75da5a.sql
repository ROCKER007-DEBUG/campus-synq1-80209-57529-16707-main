-- Create expense tracking table
CREATE TABLE IF NOT EXISTS public.expense_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.expense_tracker ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own expenses"
ON public.expense_tracker
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
ON public.expense_tracker
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
ON public.expense_tracker
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
ON public.expense_tracker
FOR DELETE
USING (auth.uid() = user_id);

-- Create books marketplace table
CREATE TABLE IF NOT EXISTS public.books_marketplace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  course TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  book_type TEXT NOT NULL CHECK (book_type IN ('pdf', 'online_access', 'physical')),
  file_url TEXT,
  website_link TEXT,
  pages INTEGER,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.books_marketplace ENABLE ROW LEVEL SECURITY;

-- Create policies for books marketplace
CREATE POLICY "Anyone can view available books"
ON public.books_marketplace
FOR SELECT
USING (status = 'available' OR auth.uid() = user_id);

CREATE POLICY "Users can insert own books"
ON public.books_marketplace
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books"
ON public.books_marketplace
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books"
ON public.books_marketplace
FOR DELETE
USING (auth.uid() = user_id);

-- Create book purchases table
CREATE TABLE IF NOT EXISTS public.book_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books_marketplace(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  access_granted BOOLEAN DEFAULT false,
  UNIQUE(book_id, buyer_id)
);

-- Enable RLS
ALTER TABLE public.book_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for book purchases
CREATE POLICY "Users can view own purchases"
ON public.book_purchases
FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can insert own purchases"
ON public.book_purchases
FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update purchase access"
ON public.book_purchases
FOR UPDATE
USING (auth.uid() = seller_id);