# Island17-Minigame-Vatom-Plugins
Project Code for Dream Tank (2022 Internship)

Overview:
    Code for Ocean Cleanup Minigame for Island17, Dream Tank's next educational video game.
    Contains two plugins for Vatom Spaces that provide main backend and frontend functionality for the minigame prototype.

Plugins:
    Tutorial Plugin:
    This plugin displays game instructions for the players.
    tutorial.js:
        Frontend interface for game instructions
    
    Pickup Plugin:
    This plugin provides the main functionality of the minigame. It is approximately designed according to the MVC design,
    slightly modified due to the constraints of the plugin system in Vatom Spaces.
    pickup.js:
        Backend that stores and updates game state data (model and controller)
    interface.js:
        Frontend interface that communicates with pickup.js to display game data (view)
           
How to use:
    Upload the plugins into desired Vatom Space's storage or another CORS enabled server, copy the url, and install the plugin.

