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

// Crée un joueur
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

    // Ajoute l'image du vaisseau
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

// Crée un alien
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

// La classe Missile crée un missile pour le joueur avec une position, une vitesse, une taille et une image.
class Missile {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: -5 };
    this.width = 3;
    this.height = 10;

    const image = new Image();
    image.src = "./assets/missile.png";
    image.onload = () => {
      this.image = image;
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

// La classe alienMissile crée un missile ennemi avec une position, une vitesse, une taille et une couleur.
class alienMissile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "yellow";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.fill();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  }
}

// La classe Grid est un conteneur pour la classe Alien, et elle est utilisée pour créer une grille d'aliens.
class Grid {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 1, y: 0 };
    this.invaders = [];
    let rows = Math.floor((world.height / 34) * (1 / 5));
    const colums = Math.floor((world.width / 34) * (2 / 5));
    this.height = rows * 34;
    this.width = colums * 34;
    for (let x = 0; x < colums; x++) {
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

// Il crée un cercle avec une position, une vitesse, un rayon, une couleur et une opacité
class Particule {
  constructor({ position, velocity, radius, color }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.opacity > 0) {
      this.opacity -= 0.01;
    }
    this.draw();
  }
}

let missiles;
let alienMissiles;
let grids;
let player;
let particules;
let lifes;

// Elle crée une nouvelle grille, un nouveau joueur, et fixe le nombre de vies à 3.
const init = () => {
  missiles = [];
  alienMissiles = [];
  grids = [new Grid()];
  player = new Player();
  particules = [];
  lifes = 3;
  keys.ArrowLeft.pressed = false;
  keys.ArrowRight.pressed = false;
};

init();

// Boucle d'animation
const animationLoop = () => {
  c.clearRect(0, 0, world.width, world.height);
  player.update();
  requestAnimationFrame(animationLoop);

  // Vérifie si le missile est hors du canevas et si c'est le cas, il le supprime du tableau.
  missiles.forEach((missile, index) => {
    if (missile.position.y + missile.height <= 0) {
      setTimeout(() => {
        missiles.splice(index, 1);
      }, 0);
    } else {
      missile.update();
    }
  });

  // Il s'agit d'une boucle forEach qui parcourt le tableau des grilles. Elle met à jour la grille et ensuite  vérifie si les images sont divisibles par 150
  // et si la longueur des ennemis de la grille est supérieure à 0. Si c'est le cas, il tire un missile.
  grids.forEach((grid, indexGrid) => {
    grid.update();
    if (frames % 150 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        alienMissiles
      );
    }

    // Check si le missile touche l'ennemi :
    grid.invaders.forEach((invader, indexI) => {
      invader.update({ velocity: grid.velocity });
      missiles.forEach((missile, indexM) => {
        if (
          missile.position.y <= invader.position.y + invader.height &&
          missile.position.y >= invader.position.y &&
          missile.position.x + missile.width >= invader.position.x &&
          missile.position.x - missile.width <=
            invader.position.x + invader.width
        ) {
          for (let i = 0; i < 12; i++) {
            particules.push(
              new Particule({
                position: {
                  x: invader.position.x + invader.width / 2,
                  y: invader.position.y + invader.height / 2,
                },
                velocity: {
                  x: (Math.random() - 0.5) * 2,
                  y: (Math.random() - 0.5) * 2,
                },
                radius: Math.random() * 5 + 1,
                color: "green",
              })
            );
          }
          setTimeout(() => {
            grid.invaders.splice(indexI, 1);

            missiles.splice(indexM, 1);
            if (grid.invaders.length === 0 && grids.length == 1) {
              grids.splice(indexGrid, 1);
              grids.push(new Grid());
            }
          }, 0);
        }
      });
    });
  });

  // Check si le missile touche le joueur :

  // Vérifie si le missile alien est sorti du tableau. Si c'est le cas, il le supprime du tableau. Si ce n'est pas le cas,
  // il le met à jour.
  alienMissiles.forEach((alienMissile, index) => {
    if (alienMissile.position.y + alienMissile.height >= world.height) {
      setTimeout(() => {
        alienMissiles.splice(index, 1);
      }, 0);
    } else {
      alienMissile.update();
    }

    // Vérifie si le missile alien touche le joueur. Si c'est le cas, il retire le missile du tableau, crée des particules et retire une vie du
    // tableau, crée des particules et enlève une vie.
    if (
      alienMissile.position.y <= player.position.y + player.height &&
      alienMissile.position.y >= player.position.y &&
      alienMissile.position.x + alienMissile.width >= player.position.x &&
      alienMissile.position.x - alienMissile.width <=
        player.position.x + player.width
    ) {
      alienMissiles.splice(index, 1);
      for (let i = 0; i < 22; i++) {
        particules.push(
          new Particule({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y + player.height / 2,
            },
            velocity: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
            },
            radius: Math.random() * 5,
            color: "white",
          })
        );
      }
      lostLife();
    }
  });

  // Suppression des particules du tableau lorsqu'elles ne sont plus visibles.
  particules.forEach((particule, index) => {
    if (particule.opacity <= 0) {
      particules.splice(index, 1);
    } else {
      particule.update();
    }
  });

  frames++;
};

animationLoop();

// Diminue le nombre de vie jusqu'a la défaite
const lostLife = () => {
  lifes--;
  if (lifes <= 0) {
    alert("Perdu");
    init();
  }
};

// Écoute de l'événement keydown et définition de la propriété pressed de l'objet keys à true.
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

// Écoute de l'événement keyup et définition de la propriété pressed de l'objet keys à false. Afin de permettre d'alterner gauche droite
// sans que le joueur reste bloqué sur une des positions
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
