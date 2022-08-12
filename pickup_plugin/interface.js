/**
 * Front-end UI
 */

 module.exports = class MyPlugin extends BasePlugin {

    /** Plugin info */
    static get id()             {return 'ui-plugin'}
    static get name()           {return 'UI'}
    static get description()    {return 'User Interface'}


    /** Called on load */
    onLoad() {
        // Create a button in the toolbar
        //inventory button
        this.menus.register({
            id: 'pickup_hud_inventory',
            icon: this.paths.absolute('button-icon.png'),
            text: 'Inventory',
            section: 'controls',
            inAccordion: false,
            action: () => this.onInvenButtonPress()
        })

        //reset game button
        this.menus.register({
            id: 'pickup_hud_reset',
            icon: this.paths.absolute('button-icon.png'),
            text: 'Reset Game',
            section: 'controls',
            inAccordion: false,
            action: () => this.onResetButtonPress()
        })

         
        this.menus.register({
            id: 'fps-hud.overlay',
            section: 'overlay-top',
            panel: {
                iframeURL: this.paths.absolute('./overlay.html')
            }
        })
        

        this.hooks.addHandler('display-inven-info', this.displayInventory)
        this.hooks.addHandler('display-win-info', this.displayWin)
        this.hooks.addHandler('display-reset', this.displayReset)
        this.hooks.addHandler('display-edu-info', this.displayEduInfo)
    }

    onMessage(data) {
        // Send current information to overlay panel
        if (data.action === 'overlay-load') {
            this.sendImages()
            this.sendInfo()
        }
    }

    onInvenButtonPress() {
        this.hooks.trigger('get-inven-score',{})
    }

    //reset for user only
    onResetButtonPress() {
        this.hooks.trigger('reset-game',{})
    }

    displayInventory = data =>{
        this.menus.alert('Plastic: ' + data['plastic'] + '\n' + 'Glass: ' + data['glass'] + '\n' + 'Metal: ' + data['metal'] + '\n','Inventory', 'info')
    }

    displayWin = data =>{
        this.menus.toast(data)
    }
    
    displayReset = data => {
        this.menus.toast({
            text: 'Reset Game!',
            textColor: '#2DCA8C',
            duration: 5000
        })
    }

    displayEduInfo = data =>{
        this.menus.toast(data)
    }
}