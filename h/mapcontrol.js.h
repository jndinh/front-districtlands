class _mapControl
{
    /*-- gmap api stuff --*/
    element emap;
    Map map; //map object from google map api
    DirectionService direction; //direction service object

    /*-- map control stuff --*/
    element menu; //main menu bar element
    element menuShow; //custom button inserted into google map
    element expandMenuButton;
    int currentMenuState;

    /*-- initialisation --*/
    void menuSet(); //menu actions
    void mapButtons(); //custom buttons rendered by google map
    void loadBorder();

    /*-- map functions --*/
    void roadLineDrawtest();
    void loadGeoJsonTest();

    /*-- utility --*/
    void menuBarState(int state);
}