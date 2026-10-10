/* Settings for the hub.

   These two values are safe to publish. Supabase calls the second one a
   "publishable" or "anon" key on purpose: every visitor's browser needs it just
   to say hello to the database. What actually protects your data is the set of
   rules in supabase/hub_setup.sql, which say that only your signed in account
   may change anything. Everyone else can read, and nothing more.

   The real secret is the "service role" key. That one never goes in this file
   and never goes on GitHub.

   This points at the same Supabase project the Flashcards app uses. The hub
   only ever touches the hub_projects table and the hub-screenshots bucket.
*/
window.HUB_CONFIG = {
  supabaseUrl: 'https://nsaiwotnsxnlroheaumt.supabase.co',
  supabaseAnonKey: 'sb_publishable_fW_S_qQImdcfLZxd1Z3PBA_eASjDSAk',

  // Only this email may turn on edit mode. It must match the rule in
  // supabase/hub_setup.sql. Changing it here alone does nothing.
  ownerEmail: 'mark.michal@cru.org'
};
