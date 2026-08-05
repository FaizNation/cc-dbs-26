/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    name: { type: 'VARCHAR(100)', notNull: true },
    email: { type: 'VARCHAR(100)', notNull: true, unique: true },
    password: { type: 'TEXT', notNull: true },
    role: { type: 'VARCHAR(20)', notNull: true },
  });

  pgm.createTable('companies', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    name: { type: 'VARCHAR(100)', notNull: true },
    location: { type: 'VARCHAR(100)', notNull: true },
    description: { type: 'TEXT' },
  });

  pgm.createTable('categories', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    name: { type: 'VARCHAR(100)', notNull: true },
  });

  pgm.createTable('jobs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'CASCADE',
    },
    title: { type: 'VARCHAR(255)', notNull: true },
    description: { type: 'TEXT', notNull: true },
    job_type: { type: 'VARCHAR(50)', notNull: true },
    experience_level: { type: 'VARCHAR(50)', notNull: true },
    location_type: { type: 'VARCHAR(50)', notNull: true },
    location_city: { type: 'VARCHAR(100)' },
    salary_min: { type: 'INTEGER' },
    salary_max: { type: 'INTEGER' },
    is_salary_visible: { type: 'BOOLEAN', default: true },
    status: { type: 'VARCHAR(20)', notNull: true, default: 'open' },
  });

  pgm.createTable('applications', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"jobs"',
      onDelete: 'CASCADE',
    },
    status: { type: 'VARCHAR(20)', notNull: true, default: 'pending' },
  });

  pgm.createTable('bookmarks', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"jobs"',
      onDelete: 'CASCADE',
    },
  });

  pgm.createTable('authentications', {
    token: { type: 'TEXT', notNull: true },
  });
  
  pgm.createTable('documents', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'CASCADE',
    },
    path: { type: 'TEXT', notNull: true },
    original_name: { type: 'VARCHAR(255)', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
  pgm.dropTable('authentications');
  pgm.dropTable('bookmarks');
  pgm.dropTable('applications');
  pgm.dropTable('jobs');
  pgm.dropTable('categories');
  pgm.dropTable('companies');
  pgm.dropTable('users');
};
