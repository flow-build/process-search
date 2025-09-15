import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS process_search (
      id UUID PRIMARY KEY,
      workflow_id UUID NOT NULL,
      final_status VARCHAR(50) NOT NULL,
      started_at TIMESTAMP WITH TIME ZONE NOT NULL,
      finished_at TIMESTAMP WITH TIME ZONE,
      final_bag JSONB,
      history JSONB,
      final_bag_vector tsvector GENERATED ALWAYS AS (
        jsonb_to_tsvector('english', final_bag, '["all"]')
      ) STORED,
      history_vector tsvector GENERATED ALWAYS AS (
        jsonb_to_tsvector('english', history, '["all"]')
      ) STORED
    );
    
    CREATE INDEX IF NOT EXISTS process_search_final_bag_vector_idx ON process_search USING GIN (final_bag_vector);
    CREATE INDEX IF NOT EXISTS process_search_history_vector_idx ON process_search USING GIN (history_vector);
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`
    DROP TABLE IF EXISTS process_search;
    
    DROP INDEX IF EXISTS process_search_final_bag_vector_idx;
    DROP INDEX IF EXISTS process_search_history_vector_idx;
  `)
}
