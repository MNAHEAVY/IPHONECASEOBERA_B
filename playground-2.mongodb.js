/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = "products";
const collection = "products";

// The current database to use.
use(database);

// Create a new collection.
db.createCollection(collection);

// The prototype form to create a collection:
db.createCollection(
  collection,
  {
    categorias: "iPhone",
    subCategoria: "iPhone",
    nombre: "Iphone 11 Pro",
    marca: "Apple",
    descripcion: "",
    imagenGeneral: [
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_midnightgreen__eqz4j67fklua_large_xnn9c4.jpg",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_silver__dyvj0fugptqq_large_fayi0h.jpg",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_spacegrey__fqy5jlddr7yy_large_c2ygah.jpg",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_gold__bci9jvstzx5u_large_qd2rqb.jpg",
    ],
    stockGeneral: 5,
    estado: "Nuevo",
    precioBase: 550,
    disponible: true,
    tipo: null,
    color: [
      {
        nombre: "Midnight Green",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_midnightgreen__eqz4j67fklua_large_xnn9c4.jpg",
        stockColor: 1,
        estado: "Nuevo",
      },

      {
        nombre: "Silver",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_silver__dyvj0fugptqq_large_fayi0h.jpg",
        stockColor: 2,
        estado: "Nuevo",
      },

      {
        nombre: "Space Gray",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_spacegrey__fqy5jlddr7yy_large_c2ygah.jpg",
        stockColor: 1,
        estado: "Nuevo",
      },

      {
        nombre: "Gold",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677533730/IPHONECASEOBERA/i11pro/compare_iphone11_pro_gold__bci9jvstzx5u_large_qd2rqb.jpg",
        stockColor: 1,
        estado: "Nuevo",
      },
    ],
    almacenamiento: [
      {
        capacidad: "64GB",
        precio: 550,
        stockStorage: 1,
        disponible: false,
        estado: "Nuevo",
      },
      {
        capacidad: "256GB",
        precio: 650,
        stockStorage: 0,
        disponible: false,
        estado: "Nuevo",
      },
      {
        capacidad: "512GB",
        precio: 750,
        stockStorage: 1,
        disponible: false,
        estado: "Nuevo",
      },
    ],

    modelo: null,
  },

  {
    categorias: "iPhone",
    subCategoria: "iPhone",
    nombre: "iPhone 14 Pro Max",
    marca: "Apple",
    descripcion: "",
    imagenGeneral: [
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536126/IPHONECASEOBERA/i14promax/iphone14promax-digitalmat-gallery-1-202209_GEO_US_wezqpr.png",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536126/IPHONECASEOBERA/i14promax/iphone14promax-digitalmat-gallery-2-202209_npo5rz.png",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536127/IPHONECASEOBERA/i14promax/iphone14promax-digitalmat-gallery-3-202209_cxba2v.png",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536127/IPHONECASEOBERA/i14promax/iphone14promax-digitalmat-gallery-4-202209_dndrct.png",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536127/IPHONECASEOBERA/i14promax/iphone14promax-digitalmat-gallery-6-202209_kiw7ln.png",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536127/IPHONECASEOBERA/i14promax/iphone14promax-digitalmat-gallery-5-202209_uj54nz.png",
    ],
    stockGeneral: 1,
    estado: "Nuevo",
    precioBase: 1360,
    disponible: true,
    tipo: null,
    color: [
      {
        nombre: "Deep Purple",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536126/IPHONECASEOBERA/i14promax/compare_iphone14_pro_max_deep_purple__diuabahv3w4m_large_xpc2sp.jpg",
        stockColor: null,
        estado: "Nuevo",
      },
      {
        nombre: "Gold",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536126/IPHONECASEOBERA/i14promax/compare_iphone14_pro_max_gold__d4ji4p0rioeq_large_kt6akj.jpg",
        stockColor: null,
        estado: "Nuevo",
      },
      {
        nombre: "Silver",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536126/IPHONECASEOBERA/i14promax/compare_iphone14_pro_max_silver__bwa8sk5umjf6_large_nzqa9c.jpg",
        stockColor: null,
        estado: "Nuevo",
      },
      {
        nombre: "Space Black",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677536126/IPHONECASEOBERA/i14promax/compare_iphone14_pro_max_space_black__bzjjitrfff2a_large_bfofd2.jpg",
        stockColor: null,
        estado: "Nuevo",
      },
    ],
    almacenamiento: [
      {
        capacidad: "128GB",
        precio: 1360,
        stockStorage: null,
        disponible: true,
        estado: "Nuevo",
      },
      {
        capacidad: "256GB",
        precio: 1460,
        stockStorage: null,
        disponible: true,
        estado: "Nuevo",
      },
      {
        capacidad: "512GB",
        precio: null,
        stockStorage: null,
        disponible: true,
        estado: "Nuevo",
      },
      {
        capacidad: "1TB",
        precio: null,
        stockStorage: null,
        disponible: true,
        estado: "Nuevo",
      },
    ],
    modelo: null,
  },

  {
    categorias: "Accesorios",
    subCategoria: "Energía y cables",
    nombre: "Battery Pack",
    marca: "Apple",
    descripcion:
      "Accesorio externo que se conecta al dispositivo para proporcionar energía adicional a la batería del iPhone. Estos dispositivos funcionan como cargadores portátiles y pueden ser muy útiles cuando se está fuera de casa o en lugares donde no hay una fuente de alimentación cercana. Los Battery Packs para iPhone generalmente tienen una batería interna que se carga a través de un cable USB y se puede usar para cargar la batería del iPhone a través del cable de carga del dispositivo. Algunos modelos tienen características de carga rápida para acelerar el proceso de carga y evitar que el usuario tenga que esperar mucho tiempo para poder usar el iPhone",
    imagenGeneral: [
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677198531/IPHONECASEOBERA/MJWY3_q15iws.jpg",
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677198532/IPHONECASEOBERA/MJWY3_AV1_lfwxol.jpg",
    ],
    stockGeneral: 1,
    estado: "Nuevo",
    precioBase: 32.82,
    disponible: true,
    tipo: null,
    color: [
      {
        nombre: "Blanco",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677198531/IPHONECASEOBERA/MJWY3_q15iws.jpg",
        stockColor: 1,
        estado: "Nuevo",
      },
    ],
    almacenamiento: null,
    modelo: null,
  },

  {
    categorias: "Accesorios",
    subCategoria: "Fundas",
    nombre: "Silicone Case Iphone 13",
    marca: "Apple",
    descripcion:
      "Accesorio elegante y duradero diseñado para proteger tu teléfono de arañazos, caídas y otros desgastes cotidianos. Fabricada en silicona de alta calidad, es suave al tacto y proporciona un agarre cómodo, además de ser fácil de limpiar. La funda se ajusta a la forma, con recortes precisos para la cámara, los puertos de carga y los botones, lo que garantiza un acceso completo a todas las características y funciones del teléfono. Se ajusta perfectamente al teléfono, sin añadir volumen ni peso innecesarios, por lo que es fácil de llevar en el bolsillo o en el bolso. El material de silicona también proporciona una excelente absorción de impactos, protegiendo el teléfono de golpes y caídas. Está disponible en varios colores para adaptarse a tu estilo y preferencias personales, desde los clásicos blanco y negro hasta tonos vivos y brillantes",
    imagenGeneral: [
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677119406/IPHONECASEOBERA/iphone_13_silicone_case_black_va5xiv.png",
    ],
    stockGeneral: 4,
    estado: "Nuevo",
    precioBase: 6.43,
    disponible: true,
    tipo: "silicon",
    color: [
      {
        nombre: "Negro",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677119406/IPHONECASEOBERA/iphone_13_silicone_case_black_va5xiv.png",
        stockColor: 1,
        estado: "Nuevo",
      },
    ],
    almacenamiento: null,

    modelo: [
      {
        nombre: "iPhone 12",
        precio: 6,
        stockModel: 1,
        disponible: false,
        imageModel:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677119406/IPHONECASEOBERA/iphone_13_silicone_case_black_va5xiv.png",
      },
    ],
  },

  {
    categorias: "Accesorios",
    subCategoria: "Fundas",
    nombre: "Case Magsafe",
    marca: "Apple",
    descripcion:
      "La funda está fabricada con materiales de alta calidad, con un perfil fino y elegante que proporciona un agarre cómodo y seguro. Incorpora imanes que se alinean perfectamente con la tecnología MagSafe del iPhone, garantizando una conexión fuerte y estable. Esto le permite colocar y retirar fácilmente la funda de su teléfono, a la vez que proporciona una sujeción fiable y segura. La funda MagSafe también ofrece una excelente protección para tu teléfono, con un suave forro de microfibra que ayuda a evitar arañazos y rozaduras. Está disponible en una gama de colores y acabados que se adaptan a tu estilo personal, desde atrevidos y brillantes a clásicos y discretos. Con su diseño innovador y su tecnología avanzada, la funda MagSafe para iPhone es el accesorio perfecto para cualquiera que quiera aprovechar al máximo las funciones y capacidades de su iPhone. Tanto si lo usas para trabajar, jugar o para el día a día, esta funda te ayudará a mantener tu teléfono seguro y con un aspecto estupendo",
    imagenGeneral: [
      "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677156314/IPHONECASEOBERA/magsafe_case_knxkx2.png",
    ],
    stockGeneral: 4,
    estado: "Nuevo",
    precioBase: 6.35,
    disponible: true,
    tipo: "MagSafe",
    color: [
      {
        nombre: "Transparente",
        imageColor:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677156314/IPHONECASEOBERA/magsafe_case_knxkx2.png",
        stockColor: 1,
        estado: "Nuevo",
      },
    ],
    almacenamiento: null,

    modelo: [
      {
        nombre: "iPhone 13",
        precio: 6,
        stockModel: 1,
        disponible: false,
        imageModel:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677156314/IPHONECASEOBERA/magsafe_case_knxkx2.png",
      },
      {
        nombre: "iPhone 12",
        precio: 6,
        stockModel: 1,
        disponible: false,
        imageModel:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677156314/IPHONECASEOBERA/magsafe_case_knxkx2.png",
      },
      {
        nombre: "iPhone 11",
        precio: 6,
        stockModel: 1,
        disponible: false,
        imageModel:
          "https://res.cloudinary.com/deqxuoyrc/image/upload/v1677156314/IPHONECASEOBERA/magsafe_case_knxkx2.png",
      },
    ],
  }
);

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
