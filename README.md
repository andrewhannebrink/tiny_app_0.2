Adding a README.

Outline
=
  Save menu
    saves current image to user's profile
  Protractor menu - clicked and unhides partial for menu w/ options:
    iconSz (x and y) - default should be calculated from maximum images allowed on screen variable - this will change with screen size
      dragged - updates app.cmp.tileX and app.cmp.tileY
    crop selector -updates app.cmp.cropX1, cropX2, cropY1, cropY2
      clicked - then drag and dropped on screen - tints cropped area
      click screen again - unselects cropped area 
  Picture menu - uploads pic
  secret menu - unhides secret mnu partial w/ options:
    emoji - default selectede (default json and icons)
    windows 95 icons (default json icons retrieved by ajax)
    android icons (default json icons retrieved by ajax)
    pokemon (default json, icons by ajax)
    sailor moon icons (default json, icosn by ajax)
    (...) (more) - opens all iconSets - REST service with iconLib API
      -make iconLib API
    -settings (above other options on its own plane)
      -background color selector
        -white
        -random
        -clear
        -custom (first implement just one custom color at a time, then multiple custom colors at a time)
          -up to 8 colors at a time
  iconify: iconifys with app.cmp
    
   

  
