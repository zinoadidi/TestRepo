
function dashboardTour(){
    var tour = new Tour({
        steps: [
        {
          element: "#myDashboard",
          title: "Welcome to Your Dashboard!",
          content: "Hi " + payday.user.Firstname + " You are one step closer to realizing your Investment Goals.\nI will be showing you around your dashboard, tap the next button to start."
        },
        {
          element: "#my-other-element",
          title: "Title of my step",
          content: "Content of my step"
        }
      ]});
      
      // Initialize the tour
      tour.init();
      
      // Start the tour
      tour.start();
    
    
    
}

function splashScreenTour(){
/*   tour = new Shepherd.Tour
  defaults:
    classes: 'shepherd-theme-arrows'

tour.addStep 'example',
  title: 'Example Shepherd'
  text: 'Creating a Shepherd is easy too! Just create ...'
  attachTo: '.hero-example bottom'
  advanceOn: '.docs-link click'

tour.start()
     */
    
}