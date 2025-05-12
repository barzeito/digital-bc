import { Router } from "express";
import validate from "../middlewares/input-validation";
import { addCardValidator, patchCardValidator } from "../controllers/cards/validator";
import { add, assignCardOwner, deleteCard, getAll, getColors, getOne, getOneById, getUserCards, patch } from "../controllers/cards/controller";
import enforceAdmin from "../middlewares/enforce-admin";
import enforceAuth from "../middlewares/enforce-auth";
import addImageToBody from "../middlewares/add-image-to-body";
import uploadImage from "../middlewares/upload-image";
import cloudinaryImageUpload from "../middlewares/couldinary-image-upload";

const router = Router();

router.get('/', getAll);
router.get('/:company', getOne);
router.get('/:id', getOneById);
router.get('/userCards/:userId', getUserCards);
router.get('/colors/:id', getColors);
router.post('/', enforceAdmin, addImageToBody, validate(addCardValidator), cloudinaryImageUpload, add);
router.delete('/:id', enforceAdmin, deleteCard);
router.patch('/:id', enforceAuth, addImageToBody, cloudinaryImageUpload, patch);
router.patch('/assign-owner/:id', enforceAdmin, assignCardOwner);
export default router;