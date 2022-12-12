const world = document.querySelector("#gameBoard"); // Représente le monde du jeu
const c = world.getContext("2d"); // Récupére le contexte du canvas

world.width = world.clientWidth; // Définis la largeur du monde en fonction du client
world.height = world.clientHeight; // Définis la hauteur du monde en fonction du client

let frames = 0; // Stock l'itération actuelle

// Stock l'état des touches claviers
const keys = {
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

class Player {
  constructor() {
    this.width = 32; // Largeur du joueur
    this.height = 32; // Hauteur du joueur
    this.velocity = {
      x: 0, // Vitesse de déplacement sur l'axe X
      y: 0, // Vitesse de déplacement sur l'axe Y
    };
    this.position = {
      x: (world.width - this.width) / 2, // Centre le joueur
      y: world.height - this.height, // Place le joueur en bas
    };
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  // A chaque mise à jour on dessine de nouveau le joueur
  update() {
    if (keys.ArrowLeft.pressed && this.position.x >= 0) {
      this.velocity.x = -5;
    } else if (
      keys.ArrowRight.pressed &&
      this.position.x <= world.width - this.width
    ) {
      this.velocity.x = 5;
    } else {
      this.velocity.x = 0;
    }
    this.position.x += this.velocity.x;
    this.draw();
  }
}

const player = new Player();

// Boucle d'animation
const animationLoop = () => {
  requestAnimationFrame(animationLoop);
  c.clearRect(0, 0, world.width, world.height);
  player.update();
  frames++;
};

animationLoop();

// Gére les mouvements de gauche à droite
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      console.log("gauche");
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      console.log("droite");
      break;
  }
});

// Réinitialise le booléen lorsque l'on appuie sur une touche
addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      console.log("gauche");
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      console.log("droite");
      break;
  }
});
