import Food from "../models/foodModel.js";

// insert food items into
export const insertFood = async (req, res) => {
  const { name, price } = req.body;

  try {
    const newFood = await Food.create({
      name,
      price,
    });

    res.status(200).json({
      success: true,
      newFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get food details
export const getFoodDetails = async (req, res) => {
  const foodId = req.params.f_id;

  try {
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
