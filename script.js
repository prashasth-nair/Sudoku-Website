const game_layout = document.getElementById("game_layout");

const dataURL = "https://sudoku-api.vercel.app/api/dosuku";
var activeCell = null;
let solution_board = [];
// Sudoku board
function createGameLayout() {
  for (let i = 0; i < 9; i++) {
    let row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < 9; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${i}-${j}`;
      row.appendChild(cell);

      if (j % 3 === 0 && j !== 0) {
        cell.style.borderLeft = "3px solid black";
        // reduce the width of the cell to avoid overlapping
        cell.style.width = "43px";
      }
    }
    game_layout.appendChild(row);

    // Make the border thicker for every 3rd row
    if (i % 3 === 0 && i !== 0) {
      row.style.borderTop = "2px solid black";
    }
  }
}

function loadGame() {
  fetch(dataURL)
    .then((response) => response.json())
    .then((data) => {
      let board = data.newboard.grids[0].value;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          let cell = document.getElementById(`cell-${i}-${j}`);
          if (board[i][j] !== 0) {
            p = document.createElement("p");
            p.className = "cell-default";
            p.innerText = board[i][j];
            cell.appendChild(p);
            // disable the cell
            cell.style.pointerEvents = "none";
            // cell.innerText = board[i][j];
          }
        }
      }
      loadSolution(data);
    })
    .catch((error) => {
      console.log("error", error);
      loadGame();
    });
}
// Function to load solution and store in 2d list
function loadSolution(data) {
  let solution = data.newboard.grids[0].solution;

  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 9; j++) {
      row.push(solution[i][j]);
    }
    solution_board.push(row);
  }
}

// Event listener for the number buttons
document.getElementById("numlayout").addEventListener("click", (e) => {
  var butt_id = e.target.id;
  if (butt_id !== "numlayout") {
    var number = document.getElementById(butt_id).value;
    if (activeCell !== null) {
      activeCell.innerHTML = number;
      if (
        solution_board[activeCell.id.split("-")[1]][
          activeCell.id.split("-")[2]
        ] !== parseInt(number)
      ) {
        activeCell.style.color = "red";
        activeCell.style.backgroundColor = "#FFCCCB";
      } else {
        activeCell.style.color = "green";
        activeCell.style.backgroundColor = "lightgreen";
      }
    }
  }
});

// Event listener for the game layout
game_layout.addEventListener("click", (e) => {
  try {
    if (activeCell !== null) {
      activeCell.style.backgroundColor = "white";
    }
    var cell_id = e.target.id;
    console.log("cell_id", cell_id);

    activeCell = document.getElementById(cell_id);
    activeCell.style.backgroundColor = "lightblue";
  } catch (e) {
    game_layout.style.backgroundColor = "white";
  }
});

// Event listener for the new game button
document.getElementById("ng_button").addEventListener("click", (e) => {
  game_layout.innerHTML = "";
  createGameLayout();
  loadGame();
});
// 1: Create Layout
createGameLayout();

// 2: Load Game
loadGame();
