import sqlite3
import os

db_path = r'C:\Users\akash\AppData\Local\cynaps\cynaps\db.sqlite3'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("== EXPERTISE CATEGORIES ==")
cursor.execute('SELECT id, name, slug, icon FROM annotators_expertisecategory ORDER BY id')
for row in cursor.fetchall():
    print(f"ID: {row[0]} | Name: {row[1]} | Slug: {row[2]} | Icon: {row[3]}")

print("\n== EXPERTISE SPECIALTIES (SKILLS) ==")
cursor.execute('''
    SELECT s.id, s.name, s.slug, s.icon, c.slug 
    FROM annotators_expertisespecialization s
    JOIN annotators_expertisecategory c ON s.category_id = c.id
    ORDER BY c.id, s.id
''')
for row in cursor.fetchall():
    print(f"ID: {row[0]} | Name: {row[1]} | Slug: {row[2]} | Icon: {row[3]} | Parent: {row[4]}")

conn.close()
