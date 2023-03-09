const { Engine, World, Render, Runner, Bodies, Body, Events } = Matter;

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal= 14;
const cellsVertical = 10;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
// Disable gravity
engine.world.gravity.y = 0;

const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width,
        height,
        wireframes: false
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls

// In matterJS, (0, 0) position will put the objects "CENTER" at the top-left point
// of the world. This is different from many other graphics libraries where objects'
// top-left point touches the world's top-left point at position (0, 0)
const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, {isStatic: true}), // top
    Bodies.rectangle(width / 2, height, width, 2, {isStatic: true}), // bottom
    Bodies.rectangle(0, height / 2, 2, height, {isStatic: true}), //left
    Bodies.rectangle(width, height / 2, 2, height, {isStatic: true}) // right
];

// We can add many elements at once
World.add(world, walls);

// Maze generation

// Anything put on fill() will be referenced in the array. Not copied. So if we
// put the inner array fill, all rows will refer to the same array which is
// not what we wanta
// "false" means unvisited cell
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

// This array will indicate gaps in the vertical walls. Shape: 3x2
const verticalGaps = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));

// This array will indicate gaps in the horizontal walls. Shape: 2x3
const horizontalGaps = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

// Generate a random position for start
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
    // If the current cell is visited, return
    if(grid[row][column]) {
        return;
    }

    // Mark the current cell as visited
    grid[row][column] = true;

    // Make an array of neighbors
    const neighbors = [
        [row - 1, column, "up"],
        [row, column + 1, "right"],
        [row + 1, column, "down"],
        [row, column - 1, "left"]
    ];

    // Randomize the array by shuffling
    shuffle(neighbors);

    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;

        // Make sure he neighbor's position is valid
        if(nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        }

        // Skip the iteration if the neighbor is already visited
        if(grid[nextRow][nextColumn]) {
            continue;
        }

        // Remove a wall for accessing that neighbor
        if(direction === "left") {
            verticalGaps[row][column - 1] = true;
        } else if(direction === "right") {
            verticalGaps[row][column] = true;
        } else if(direction === "up") {
            horizontalGaps[row - 1][column] = true;
        } else if(direction === "down") {
            horizontalGaps[row][column] = true;
        }

        // Visit the next cell
        stepThroughCell(nextRow, nextColumn);
    }
};

const shuffle = arr => {
    let counter = arr.length;

    while(counter > 0) {
        const randIndex = Math.floor(Math.random() * counter);

        counter--;

        [arr[counter], arr[randIndex]] = [arr[randIndex], arr[counter]];
    }
}

stepThroughCell(startRow, startColumn)

// Drawing the maze

// Drawing horizontal walls
horizontalGaps.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open) {
            return;
        }

        const wall = Bodies.rectangle(
            (columnIndex * unitLengthX) + (unitLengthX / 2),
            (rowIndex * unitLengthY) + unitLengthY,
            unitLengthX,
            3,
            {
                label: "wall",
                isStatic: true,
                render: {
                    fillStyle: "red"
                }
            }
        );

        World.add(world, wall);
    });
});

// Drawing vertical walls
verticalGaps.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open) {
            return;
        }

        const wall = Bodies.rectangle(
            (columnIndex * unitLengthX) + unitLengthX,
            (rowIndex * unitLengthY) + (unitLengthY / 2),
            3,
            unitLengthY,
            {
                label: "wall",
                isStatic: true,
                render: {
                    fillStyle: "red"
                }
            }
        );

        World.add(world, wall);
    });
});

// Drawing the goal
const goal = Bodies.rectangle(
    width - (unitLengthX / 2),
    height - (unitLengthY / 2),
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
        label: "goal",
        isStatic: true,
        render: {
            fillStyle: "green"
        }
    }
);

World.add(world, goal);

// Drawing the ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: "ball",
        render: {
            fillStyle: "yellow"
        }
    }
);

World.add(world, ball);


// Handling keyboard inputs
document.addEventListener("keydown", event => {
    const { x, y } = ball.velocity;

    if(event.keyCode == 87) {
        // Go up
        Body.setVelocity(ball, {x, y: y - 5});
    } else if(event.keyCode == 68) {
        // Go right
        Body.setVelocity(ball, {x: x + 5, y});
    } else if(event.keyCode == 83) {
        // Go down
        Body.setVelocity(ball, {x, y: y + 5});
    } else if(event.keyCode == 65) {
        // Go left
        Body.setVelocity(ball, {x: x - 5, y});
    }
});

// Win condition
Events.on(engine, "collisionStart", event => {
    event.pairs.forEach(collision => {
        const labels = ["ball", "goal"];

        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            document.querySelector(".winner").classList.remove("hidden");

            // Enable gravity
            world.gravity.y = 1;

            world.bodies.forEach(body => {
                if(body.label === "wall") {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});