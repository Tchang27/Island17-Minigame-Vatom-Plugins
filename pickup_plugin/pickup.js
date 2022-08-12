/**
 * This is the main entry point for your plugin.
 *
 * All information regarding plugin development can be found at
 * https://developer.vatom.com/plugins/plugins/
 *
 * @license MIT
 * @author Vatom Inc.
 */

/**Backend Data */
let activeItems = []
let map_score = {}
let nft_id = 0
let win_score = 10

 module.exports = class MyPlugin extends BasePlugin {

    /** Plugin info */
    static get id()             {return 'pickup-plugin'}
    static get name()           {return 'Pickup'}
    static get description()    {return 'Allows creation of pickups'}


    /** Called on load */
    onLoad() {
        // Create a button in the toolbar
        this.objects.registerComponent(ObjectPickup, {
            id: 'object-pickup',
            name: 'Object',
            description: 'Converts object to an interactable pickup',
            settings: [
                { id: 'trigger-distance', name: 'Trigger Distance', type: 'number', default: 5, help: 'How far, \
                in metres, the user has to be to trigger the pickup' },
                { id: 'respawn-time', name: 'Respawn Time', type: 'number', default: 0.01, help: 'How long, in \
                seconds, it takes for the pickup to respawn'},
                { id: 'amount', name: 'Count', type: 'number', default: 1, help: 'Value of pickup' },
                { id: 'type', name: 'Item Type', type: 'string', default: 'Plastic', help: 'Classification of item'}
            ]
        })

        map_score['plastic'] = 0
        map_score['glass'] = 0
        map_score['metal'] = 0

        this.hooks.addHandler('get-inven-score', this.returnScoreMessage)
        this.hooks.addHandler('reset-game', this.returnResetMessage)
    }


    returnScoreMessage = data => {
        // Show alert
        this.menus.alert("Here")
        let sum = 0
        for(let key in map_score){
            sum += map_score[key]
        }

        if((sum) > win_score){
            //calculate nft id - futureproofing
            //based on collected items, generate an id for nft (idea - there are three different nfts and collecting different items increases probabilities for different nfts)
            var prob_map = []
            var cur = 0
            for(let key in map_score){
                prob_map.push(map_score[key] + cur)
                cur = map_score[key] + cur
            }
            var seed = Math.random()*win_score
            for(let i = 0; i < prob_map.length; i++){
                if(seed < prob_map[i]){
                    nft_id = i
                    break
                }
            }

            // notify user
            val = {
                text: "Congratulations! Your NFT: " + String(nft_id),
                textColor: '#2DCA8C',
                duration: 5000
            }
            this.hooks.trigger('display-win-info', val)
        }else{
            //notify user
            this.hooks.trigger('display-inven-info', map_score)
        }


    }

    //reset for user only
    returnResetMessage = data => {
        // reset score
        for(let key in map_score){
            map_score[key] = 0
        }
        for(let item of activeItems){
            item.respawnPickup()
        }
        this.hooks.trigger('display-reset',{})
    }

}

class ObjectPickup extends BaseComponent {
    onLoad() {
        this.timer = setInterval(this.onTimer.bind(this), 200)
        this.hasTriggered = false

        activeItems.push(this)
    }

    onUnload() {
        activeItems = activeItems.filter(c => c != this)
    }

    //called when action is performed
    onAction(action) {

        // Remove this pick-up
        if (action == 'remove-pickup') {
            this.plugin.objects.remove(this.objectID)
        }

    }

     /** Called on a regular basis to check if user can pick up this power-up */
     async onTimer() {

        // Only allow triggering once
        if (this.hasTriggered) {
            return
        }

        // Get user position
        let userPos = await this.plugin.user.getPosition()
        
        // Get object position 
        const x = this.fields.x       || 0
        const y = this.fields.height  || 0
        const z = this.fields.y       || 0

        // Calculate distance between the user and this pickup
        const distance = Math.sqrt((x - userPos.x) ** 2 + (y - userPos.y) ** 2 + (z - userPos.z) ** 2)

        // If close enough, trigger Mine
        let triggerDistance = parseFloat(this.getField('trigger-distance')) || 1
        if (distance < triggerDistance) {
            this.onPickup()
            return
        }       

    }

    /** Pick up this power-up */
    async onPickup() {

        this.hasTriggered = true

        let infotype = this.getField('type')
        
        map_score[infotype] += parseFloat(this.getField('amount')) || 1
       

        // Hide pickup
        this.plugin.objects.update(this.objectID, { hidden: true }, true)
        
        //Show educational message:
        
        let conditional_text = "hello"
        if(infotype == 'plastic'){
            conditional_text = "Educational info about plastic goes here"
        }else if(infotype == 'glass'){
            conditional_text = "Educational info about glass goes here"
        }else if(infotype == 'metal'){
            conditional_text = "Educational info about metal goes here"
        }else{
            conditional_text = "Educational info about item goes here"
        }
        let blurb = {
            text: conditional_text,
            textColor: '#2DCA8C',
            duration: 5000
        }

        this.plugin.hooks.trigger('display-edu-info', blurb)
        

    }
    
    //respawn pickup
    respawnPickup() {
        this.plugin.objects.update(this.objectID, { hidden: false }, true)
        this.hasTriggered = false
    }

}