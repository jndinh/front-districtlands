class _mapControl
{
    /*-- gmap api stuff --*/
    element emap;
    Map map; //map object from google map api

    /*-- map control elements --*/
    element menu; //main menu bar element
    element menuShow; //custom button inserted into google map
    element expandMenuButton;
    int currentMenuState;

    /*-- geo features stuff --*/
    string-array Rcolour;
    feature border;
    int userSelectMode;
    object tracks;

    /*-- initialisation --*/
    void menuSet(); //menu actions
    void mapButtons(); //custom buttons rendered by google map
    void loadFeatures();
    void genFourColour(); //choose 4 colours to use for feature shaders

    /*-- map functions --*/
    void selectTrack();
    void loadGeoJsonTest();
    void loadAlgoTest();

    /*-- utility --*/
    void menuBarState(int state);
    void fadeBorder(float opacity); //hide border fill, or set to given value
    void resetTracks(); //hide all coloured tracks
}