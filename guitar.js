var numberOfDrumButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numberOfDrumButtons; i++) {

  document.querySelectorAll(".drum")[i].addEventListener("click", function() {

    var buttonInnerHTML = this.innerHTML;

    makeSound(buttonInnerHTML);

    buttonAnimation(buttonInnerHTML);

  });

}

document.addEventListener("keypress", function(event) {

  makeSound(event.key);

  buttonAnimation(event.key);

});


function makeSound(key) {

  switch (key) {
    case "w":
      var tom1 = new Audio("sounds/1.aif");
      tom1.play();
      break;

    case "a":
      var tom2 = new Audio("sounds/2.aif");
      tom2.play();
      break;

    case "s":
      var tom3 = new Audio('sounds/3.wav');
      tom3.play();
      break;

    case "d":
      var tom4 = new Audio('sounds/4.wav');
      tom4.play();
      break;

    case "j":
      var snare = new Audio('sounds/5.wav');
      snare.play();
      break;

    case "k":
      var crash = new Audio('sounds/6.wav');
      crash.play();
      break;

    default: console.log(key);

  }
}


function buttonAnimation(currentKey) {

  var activeButton = document.querySelector("." + currentKey);

  activeButton.classList.add("pressed");

  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);

}
