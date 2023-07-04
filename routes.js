import { readJSONBody } from '@iannisz/node-api-kit';
import { StockfishInstance } from 'node-stockfish';
export const startAnalysing = async (req, res) => {
    const body = await readJSONBody(req);
    if (body.moves == null && body.fen == null) {
        res.statusCode = 400;
        res.end('Missing "moves" or "fen" field in request body.');
        return;
    }
    const stockfishInstance = StockfishInstance.getInstance();
    if (body.moves == null) {
        // Use the FEN string to set the board state.
        stockfishInstance.setBoardstateByFen(body.fen);
    }
    else {
        // Use the moves string to set the board state.
        stockfishInstance.setBoardstateByMoves(body.moves);
    }
    // Start analysing the board state.
    stockfishInstance.startAnalysing({
        lines: body.lines
    });
    const response = {
        id: stockfishInstance.id
    };
    res.end(JSON.stringify(response));
};
export const stopAnalysing = async (req, res) => {
    const body = await readJSONBody(req);
    if (body.id == null) {
        res.statusCode = 400;
        res.end('Missing "id" field in request body.');
        return;
    }
    const stockfishInstance = StockfishInstance.usedInstances.get(body.id);
    if (stockfishInstance == null) {
        res.statusCode = 404;
        res.end('No analysis with the given ID found.');
        return;
    }
    stockfishInstance.stopAnalysing();
    stockfishInstance.stopUsing();
    res.end('The analysis has been stopped.');
    return;
};
export const getBestLines = async (req, res) => {
    const body = await readJSONBody(req);
    if (body.id == null) {
        res.statusCode = 400;
        res.end('Missing "id" field in request body.');
        return;
    }
    const stockfishInstance = StockfishInstance.usedInstances.get(body.id);
    if (stockfishInstance == null) {
        res.statusCode = 404;
        res.end('No analysis with the given ID found.');
        return;
    }
    const response = stockfishInstance.getCurrentBestLines();
    res.end(JSON.stringify(response));
};
