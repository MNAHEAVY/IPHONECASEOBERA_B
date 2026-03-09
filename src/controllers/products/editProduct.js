const Products = require("../../models/products");

const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      slug,
      brand,
      category,
      subCategory,
      description,
      images = [],
      variants = [],
      seo = {},
      compatibleWith = [],
    } = req.body;

    product.name = name;
    product.slug = slug;
    product.brand = brand;
    product.category = category;
    product.subCategory = subCategory;
    product.description = description;
    product.images = images;
    product.variants = variants.map((variant) => {
      const stock = Number(variant.stock) || 0;

      return {
        ...variant,
        price: Number(variant.price) || 0,
        stock,
        available: stock > 0,
        images: variant.images || [],
        attributes: {
          color: variant.attributes?.color || "",
          model: variant.attributes?.model || "",
          storage: variant.attributes?.storage || "",
          size: variant.attributes?.size || "",
        },
      };
    });
    product.seo = {
      title: seo?.title || "",
      description: seo?.description || "",
    };
    product.compatibleWith = compatibleWith;

    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = updateProduct;
