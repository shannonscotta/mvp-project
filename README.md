<!-- # mvp-project

## migrate and seed db to render (prod)
`psql -f db/migration.sql EXTERNAL_DB_URL_FROM_RENDER`
`psql -f db/seed.sql EXTERNAL_DB_URL_FROM_RENDER`

## 'shortcut'
`psql EXTERNAL_DB_URL_FROM_RENDER`
`\i db/migration.sql`
`\i db/seed.sql`

## deploy server




# npm run migrate to migrate and seed

# db ur

`npm start` then go check localhost:3000 -->


# learning points

- 'user' is a reserved keyword for table names and cannot be used unless wrapped in a quotes
- HTML inputs have tons of helpful autocomplete options 
- want to delete all records in a table but keep the table structure / columns constraints? use `DELETE FROM tablename`

