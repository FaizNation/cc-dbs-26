/* eslint-disable camelcase */

exports.up = (pgm) => {
  // Categories
  pgm.addColumns('categories', {
    created_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Jobs
  pgm.addColumns('jobs', {
    created_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Applications
  pgm.addColumns('applications', {
    created_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Bookmarks
  pgm.addColumns('bookmarks', {
    created_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'TEXT', notNull: true, default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('categories', ['created_at', 'updated_at']);
  pgm.dropColumns('jobs', ['created_at', 'updated_at']);
  pgm.dropColumns('applications', ['created_at', 'updated_at']);
  pgm.dropColumns('bookmarks', ['created_at', 'updated_at']);
};
