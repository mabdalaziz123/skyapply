-- Database: skyapply

CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_en TEXT,
    name_tr TEXT,
    country TEXT,
    country_en TEXT,
    country_tr TEXT,
    city TEXT,
    city_en TEXT,
    city_tr TEXT,
    image TEXT,
    logo TEXT,
    description TEXT,
    description_en TEXT,
    description_tr TEXT,
    ranking TEXT,
    students TEXT,
    type TEXT,
    type_en TEXT,
    type_tr TEXT,
    founded TEXT,
    website_url TEXT,
    features JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_en TEXT,
    name_tr TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_en TEXT,
    name_tr TEXT,
    language TEXT,
    language_en TEXT,
    language_tr TEXT,
    price TEXT,
    duration TEXT,
    duration_en TEXT,
    duration_tr TEXT,
    degree TEXT,
    degree_en TEXT,
    degree_tr TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_en TEXT,
    title_tr TEXT,
    content TEXT,
    content_en TEXT,
    content_tr TEXT,
    author TEXT,
    image TEXT,
    read_time TEXT,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'blogger' CHECK (role IN ('admin', 'blogger')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration: Add multilingual columns to existing tables
ALTER TABLE universities ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS name_tr TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS description_tr TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS city_en TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS city_tr TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS country_en TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS country_tr TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS type_en TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS type_tr TEXT;

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS name_tr TEXT;

ALTER TABLE branches ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS name_tr TEXT;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_tr TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_tr TEXT;

ALTER TABLE branches ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS name_tr TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS degree_en TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS degree_tr TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS language_en TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS language_tr TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS duration_en TEXT;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS duration_tr TEXT;
