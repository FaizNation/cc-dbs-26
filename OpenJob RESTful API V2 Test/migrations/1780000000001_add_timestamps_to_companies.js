/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('companies', {
    created_at: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('companies', ['created_at', 'updated_at']);
};
