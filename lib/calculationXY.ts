interface XYCoords {
   pageX: number;
   pageY: number;
   clientX: number;
   clientY: number;
}

export function getRealXY(e: MouseEvent): XYCoords {
   let pageX = e.pageX;
   let pageY = e.pageY;
   let clientX = e.clientX; //horizontal coordinate within the application's viewport
   let clientY = e.clientY; //vertical coordinate within the application's viewport

   // Adjust for horizontal overflow
   if (clientX < 0) {
      //Hoverflow Left
      pageX = e.pageX - e.clientX;
      clientX = 0;
   } else if (clientX > window.innerWidth) {
      //Hoverflow Right
      pageX = e.pageX - (e.clientX - window.innerWidth);
      clientX = window.innerWidth;
   }

   // Adjust for vertical overflow
   if (clientY < 0) {
      //Hoverflow up
      pageY = e.pageY - e.clientY;
      clientY = 0;
   } else if (clientY > window.innerHeight) {
      //Hoverflow down
      pageY = e.pageY - (e.clientY - window.innerHeight);
      clientY = window.innerHeight;
   }
   return { pageX, pageY, clientX, clientY };
}

export function adjustXYSelectionMenu(coords: XYCoords) {
   const viewportWidth = window.innerWidth;
   const menuHeight = 250; // approximate height of your menu (adjust as needed)
   const menuWidth = 250; // approximate width of your menu (adjust as needed)
   const visualGap = 15; // E.g. i select whole paragraph with triple click

   // // Check for right edge case
   if (coords.clientX + menuWidth > viewportWidth) {
      coords.pageX = Math.max(coords.pageX - menuWidth, 0);
   } else {
      coords.pageX += visualGap;
   }

   return { xPos: coords.pageX, yPos: coords.clientY };
}
