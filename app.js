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

class Alien {
  constructor({ position }) {
    this.velocity = { x: 0, y: 0 };
    const image = new Image();
    image.src = "./assets/ennemi.png";
    image.onload = () => {
      this.image = image;
      this.width = 32;
      this.height = 32;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update({ velocity }) {
    if (this.image) {
      this.position.x += velocity.x;
      this.position.y += velocity.y;
      if (this.position.y + this.height >= world.height) {
        console.log("You loose");
      }
    }
    this.draw();
  }

  shoot(alienMissiles) {
    if (this.position) {
      alienMissiles.push(
        new alienMissile({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          velocity: {
            x: 0,
            y: 3,
          },
        })
      );
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

class alienMissile {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: -4 };
    this.width = 3;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "green";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.fill();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  }
}

class Grid {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 1, y: 0 };
    this.invaders = [];
    let rows = Math.floor((world.height / 34) * (1 / 3));
    const columns = Math.floor((world.width / 34) * (2 / 3));
    this.height = rows * 34;
    this.width = columns * 34;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Alien({
            position: {
              x: x * 34,
              y: y * 34,
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;
    if (this.position.x + this.width >= world.width || this.position.x == 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 34;
    }
  }
}

const missiles = [];
let grids = [new Grid()];
const player = new Player();
let particules = [];

// Boucle d'animation
const animationLoop = () => {
  c.clearRect(0, 0, world.width, world.height);
  player.update();
  requestAnimationFrame(animationLoop);

  missiles.forEach((missile, index) => {
    if (missile.position.y + missile.height <= 0) {
      setTimeout(() => {
        missiles.splice(index, 1);
      }, 0);
    } else {
      missile.update();
    }
  });

  grids.forEach((grid) => {
    grid.update();
    grid.invaders.forEach((invader) => {
      invader.update({ velocity: grid.velocity });
    });
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
