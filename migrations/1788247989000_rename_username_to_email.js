/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.renameColumn('users', 'username', 'email');
  pgm.renameConstraint('users', 'users_username_key', 'users_email_key');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.renameConstraint('users', 'users_email_key', 'users_username_key');
  pgm.renameColumn('users', 'email', 'username');
};
