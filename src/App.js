import React from "react";

const rowStyle = {
  display: "flex",
};

const playerStyle = {
  X: {
    backgroundImage: "url('sam.png')",
    backgroundRepeat: "round",
    width: "100%",
    height: "100%"
  },
  O: {
    backgroundImage: "url('casper.png')",
    backgroundRepeat: "round",
    width: "100%",
    height: "100%"
  }
}

const squareStyle = {
  width: "60px",
  height: "60px",
  backgroundColor: "#ddd",
  margin: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20px",
  color: "white",
};

const boardStyle = {
  backgroundColor: "#eee",
  width: "208px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  border: "3px #eee solid",
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
};

const winnerStyle = {
  X: {
    backgroundImage: "url('sam.png')",
    ...containerStyle
  },
  O: {
    backgroundImage: "url('casper.png')",
    ...containerStyle
  }
}

const instructionsStyle = {
  marginTop: "5px",
  marginBottom: "5px",
  fontWeight: "bold",
  fontSize: "16px",
};

const buttonStyle = {
  marginTop: "15px",
  marginBottom: "16px",
  width: "80px",
  height: "40px",
  backgroundColor: "#8acaca",
  color: "white",
  fontSize: "16px",
};

const Square = React.memo(({ status, rowIndex, cellIndex, onSet }) => {
  console.log("rendered cell")
  return (
  <div
    className="square"
    style={squareStyle}
    role="button"
    tabIndex={0}
    onClick={(e) => {
      if (status) e.preventDefault();
      else onSet(rowIndex, cellIndex);
    }}
  >
    <div style={playerStyle[status]}></div>
  </div>
)});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPlayer: "X",
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      winner: null,
    };

  }

  reset = () => {
    this.setState({
      currentPlayer: "X",
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      winner: null,
    });
  };

  setBoardCellStatus = (rId, cId) => {
    const { board, currentPlayer } = this.state;

    const nextBoard = board.map((row, rowIndex) => {
      if (rowIndex !== rId) return row;
      return row.map((cell, cellIndex) => {
        if (cellIndex !== cId) return cell;
        return currentPlayer;
      });
    });

    const winner = getWinner(nextBoard);

    this.setState({
      board: nextBoard,
      currentPlayer: currentPlayer === "X" ? "O" : "X",
      winner,
    });
  };

  render() {
    const { currentPlayer, board, winner } = this.state;
    const names = {
      "X": "Sam",
      "O": "Casper"
    };
    return (
      <div style={winner ? winnerStyle[winner] : containerStyle} className="gameBoard">
        <div className="status" style={instructionsStyle}>
          Next player: {names[currentPlayer]}
        </div>
        {winner && (
          <div className="winner" style={instructionsStyle}>
            Winner: {names[winner]}
          </div>
        )}
        <button style={buttonStyle} onClick={this.reset}>
          Reset
        </button>
        <div style={boardStyle}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row" style={rowStyle}>
              {row.map((cell, cellIndex) => (
                <Square
                  key={cellIndex}
                  status={cell}
                  rowIndex={rowIndex}
                  cellIndex={cellIndex}
                  onSet={this.setBoardCellStatus}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

export default Game;

// =============================================================

const getXY = (index, rowCount) => {
  return { x: index % rowCount, y: Math.floor(index / rowCount) };
};

const getWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const a = getXY(lines[i][0], 3);
    const b = getXY(lines[i][1], 3);
    const c = getXY(lines[i][2], 3);
    if (
      board[a.y][a.x] &&
      board[a.y][a.x] === board[b.y][b.x] &&
      board[a.y][a.x] === board[c.y][c.x]
    ) {
      return board[a.y][a.x];
    }
  }

  return null;
};