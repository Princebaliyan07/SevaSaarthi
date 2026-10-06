import { processAiTriage } from '../services/ai.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const chatTriage = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message || !message.trim()) {
    throw new ApiError(400, 'Message cannot be empty');
  }

  const result = await processAiTriage(message, history);
  return res.status(200).json(new ApiResponse(200, result, 'AI Saarthi triage response'));
});

export const legacyTriage = asyncHandler(async (req, res) => {
  const { query, language = 'en' } = req.body;

  if (!query || !query.trim()) {
    throw new ApiError(400, 'Query is required');
  }

  const result = await processAiTriage(query);
  return res.status(200).json(new ApiResponse(200, result, 'AI Saarthi guidance'));
});

export default {
  chatTriage,
  legacyTriage,
};
