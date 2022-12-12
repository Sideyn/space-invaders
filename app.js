const world = document.querySelector("#gameBoard"); // Représente le monde du jeu
const c = world.getContext("2d"); // Récupére le contexte du canvas

world.width = world.clientWidth; // Définis la largeur du monde en fonction du client
world.height = world.clientHeight; // Définis la hauteur du monde en fonction du client

let frames = 0; // Stock l'itération actuelle
const missiles = [];

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

    const image = new Image();
    image.src = "./assets/vaisseau.png";
    image.onload = () => {
      this.image = image;
      this.width = 48;
      this.height = 48;
      this.position = {
        x: world.width / 2 - this.width / 2,
        y: world.height - this.height - 10,
      };
    };
  }

  // Dessine l'image du vaisseau
  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  // Permet au joueur de tirer
  shoot() {
    missiles.push(
      new Missile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y,
        },
      })
    );
  }

  // A chaque mise à jour on dessine de nouveau le joueur
  update() {
    if (this.image) {
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
}

class Missile {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: -4 };
    this.width = 3;
    this.height = 10;

    const image = new Image();
    image.src = "./assets/missile.png";
    image.onload = () => {
      this.image = image;
      this.width = 24;
      this.height = 24;
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.position.y += this.velocity.y;
    this.draw();
  }
}

const player = new Player();

// Boucle d'animation
const animationLoop = () => {
  requestAnimationFrame(animationLoop);
  c.clearRect(0, 0, world.width, world.height);

  player.update();

  missiles.forEach((missile, index) => {
    if (missile.position.y + missile.height <= 0) {
      setTimeout(() => {
        missiles.splice(index, 1);
      }, 0);
    } else {
      missile.update();
    }
  });

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
    case " ":
      player.shoot();
      console.log(missiles);
  }
});
