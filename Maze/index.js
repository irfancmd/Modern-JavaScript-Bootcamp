const { Engine, World, Render, Runner, Bodies, Mouse, MouseConstraint } = Matter;

const width = 800;
const height = 600;

const engine = Engine.create();
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

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}));

// Walls
// In matterJS, (0, 0) position will put the objects "CENTER" at the top-left point
// of the world. This is different from many other graphics libraries where objects'
// top-left point touches the world's top-left point at position (0, 0)
const walls = [
    Bodies.rectangle(400, 0, 800, 40, {isStatic: true}), // top
    Bodies.rectangle(400, 600, 800, 40, {isStatic: true}), // bottom
    Bodies.rectangle(0, 300, 40, 600, {isStatic: true}), //left
    Bodies.rectangle(800, 300, 40, 600, {isStatic: true}) // right
];

// We can add many elements at once
World.add(world, walls);

// Add random shapes at random places
for(let i = 0; i < 20; i++) {
    if(Math.random() > 0.5) {
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50));
    } else {
        World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 35, {
            render: {
                fillStyle: "green"
            }
        }));
    }
}


