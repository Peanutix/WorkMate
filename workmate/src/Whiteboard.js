import React, { useRef, useState, useEffect } from 'react';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [mode, setMode] = useState("draw"); // 'draw' or 'erase'
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
    }, []);

    // Save current state for undo
    const saveState = () => {
        const canvas = canvasRef.current;
        setHistory((prev) => [...prev, canvas.toDataURL()]);
        setRedoStack([]); // Clear redo stack when new action is made
    };

    const startDrawing = (e) => {
        saveState(); // Save state before drawing
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setLastPosition({ x: offsetX, y: offsetY });
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { offsetX, offsetY } = e.nativeEvent;

        ctx.strokeStyle = mode === "erase" ? "white" : "black";
        ctx.lineWidth = mode === "erase" ? 10 : 1.5; // Thicker stroke for eraser
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        setLastPosition({ x: offsetX, y: offsetY });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        saveState();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const undo = () => {
        if (history.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const previousState = history.pop();
        setRedoStack((prev) => [...prev, canvas.toDataURL()]); // Save current state for redo
        setHistory([...history]);

        const img = new Image();
        img.src = previousState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const nextState = redoStack.pop();
        setHistory((prev) => [...prev, canvas.toDataURL()]); // Save current state for undo
        setRedoStack([...redoStack]);

        const img = new Image();
        img.src = nextState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>React Whiteboard</h1>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ border: '1px solid #000', backgroundColor: 'white' }}
            />
            <div style={{ marginTop: '20px' }}>
                <button className="whiteboard_button" onClick={() => setMode("draw")}>Draw</button>
                <button className="whiteboard_button" onClick={() => setMode("erase")}>Erase</button>
                <button className="whiteboard_button" onClick={clearCanvas}>Clear</button>
                <button className="whiteboard_button" onClick={undo}>Undo</button>
                <button className="whiteboard_button" onClick={redo}>Redo</button>
            </div>
        </div>
    );
};

export default Whiteboard;
