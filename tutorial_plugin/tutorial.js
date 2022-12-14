/**
 * This is the main entry point for your plugin.
 *
 * All information regarding plugin development can be found at
 * https://developer.vatom.com/plugins/plugins/
 *
 * @license MIT
 * @author Vatom Inc.
 */
 module.exports = class MyPlugin extends BasePlugin {

    /** Plugin info */
    static id = "game_tutorial"
    static name = "Game Tutorial"

    /** Called on load */
    onLoad() {

        // Create a button in the toolbar
        this.menus.register({
            icon: this.paths.absolute('button-icon.png'),
            text: 'Tutorial',
            action: () => this.onButtonPress()
        })

    }

    /** Called when the user presses the action button */
    onButtonPress() {

        // Show alert
        this.menus.alert(`Collect trash from the surrounding environment to complete the level`, 'Ocean Cleanup Game', 'info')

    }

}