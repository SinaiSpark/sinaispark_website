/**
 * The site has no visitor accounts, so the plugin's "User" list is hidden
 * from the Content Manager sidebar. The plugin itself stays: its roles and
 * settings are still under Settings → Users & Permissions. Admin logins are
 * separate (Settings → Administration panel → Users).
 */
type Plugin = {
  contentTypes: Record<
    string,
    { schema: { pluginOptions?: Record<string, unknown> } }
  >
}

export default (plugin: Plugin) => {
  const { schema } = plugin.contentTypes.user
  schema.pluginOptions = {
    ...schema.pluginOptions,
    "content-manager": { visible: false },
  }
  return plugin
}
