// seedBooks.ts

import { Client } from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config(); // Load environment variables

const bookNames = [
  'The Great Gatsby', 'To Kill a Mockingbird', '1984', 'Pride and Prejudice',
  'Moby Dick', 'The Catcher in the Rye', 'Brave New World', 'The Hobbit',
  'War and Peace', 'Crime and Punishment', 'The Odyssey', 'Hamlet',
  'The Divine Comedy', 'The Brothers Karamazov', 'Jane Eyre', 'Wuthering Heights',
  'The Lord of the Rings', 'The Alchemist', 'The Little Prince', 'Don Quixote',
  'The Grapes of Wrath', 'Anna Karenina', 'Fahrenheit 451', 'Dracula', 'Les Misérables',
  'The Stranger', 'Madame Bovary', 'Ulysses', 'The Sound and the Fury', 'Great Expectations',
  'Frankenstein', 'Heart of Darkness', 'Beloved', 'A Tale of Two Cities', 'Middlemarch',
  'The Picture of Dorian Gray', 'Lolita', 'The Sun Also Rises', 'On the Road', 'Slaughterhouse-Five'
];

const authors = [
  'F. Scott Fitzgerald', 'Harper Lee', 'George Orwell', 'Jane Austen',
  'Herman Melville', 'J.D. Salinger', 'Aldous Huxley', 'J.R.R. Tolkien',
  'Leo Tolstoy', 'Fyodor Dostoevsky', 'Homer', 'William Shakespeare',
  'Dante Alighieri', 'Fyodor Dostoevsky', 'Charlotte Brontë', 'Emily Brontë',
  'J.R.R. Tolkien', 'Paulo Coelho', 'Antoine de Saint-Exupéry', 'Miguel de Cervantes',
  'John Steinbeck', 'Leo Tolstoy', 'Ray Bradbury', 'Bram Stoker', 'Victor Hugo',
  'Albert Camus', 'Gustave Flaubert', 'James Joyce', 'William Faulkner', 'Charles Dickens',
  'Mary Shelley', 'Joseph Conrad', 'Toni Morrison', 'Charles Dickens', 'George Eliot',
  'Oscar Wilde', 'Vladimir Nabokov', 'Ernest Hemingway', 'Jack Kerouac', 'Kurt Vonnegut'
];

const publishers = [
  'Penguin Classics', 'HarperCollins', 'Vintage', 'Random House',
  'Oxford University Press', 'Simon & Schuster', 'Houghton Mifflin', 'Knopf',
  'Bantam Books', 'Bloomsbury', 'Macmillan Publishers', 'Scribner',
  'Modern Library', 'Grove Press', 'Little, Brown and Company', 'Picador',
  'Harcourt Brace', 'Secker & Warburg', 'Anchor Books', 'Faber & Faber'
];

const subjects = [
  'Literature', 'Philosophy', 'History', 'Science Fiction', 'Fantasy',
  'Drama', 'Adventure', 'Romance', 'Psychology', 'Political Science'
];

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPublicationYear() {
  return (Math.floor(Math.random() * 100) + 1920).toString(); // Random year between 1920 - 2020
}

async function seedBooks() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // 1. Find an existing ADMIN user (since books must be createdBy someone)
    const res = await client.query("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
    let userId: string;

    if (res.rows.length > 0) {
      userId = res.rows[0].id;
      console.log(`✅ Found existing admin user with id: ${userId}`);
    } else {
      userId = uuidv4();
      await client.query(
        `
          INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `,
        [
          userId,
          'Default',
          'Admin',
          'admin@example.com',
          'password_hash_here', // ⚠️ Hash it properly in real case
          'ADMIN',
        ]
      );
      console.log(`✅ Created default admin user with id: ${userId}`);
    }

    // 2. Insert 40 books
    for (let i = 0; i < 40; i++) {
      await client.query(
        `
          INSERT INTO books (
            name, author, publisher, "publicationYear", subject, created_at, updated_at, "createdById"
          ) VALUES (
            $1, $2, $3, $4, $5, NOW(), NOW(), $6
          )
        `,
        [
          `${bookNames[i]} (${i})`, // Make book names UNIQUE (small trick)
          authors[i],
          getRandom(publishers),
          randomPublicationYear(),
          getRandom(subjects),
          userId,
        ]
      );
    }

    console.log('✅ Successfully seeded 40 meaningful books.');
  } catch (error) {
    console.error('❌ Error seeding books:', error);
  } finally {
    await client.end();
  }
}

seedBooks();
