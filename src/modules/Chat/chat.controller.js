import { companyModel } from "../../../database/models/company.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createCompany = catchAsync(async (req, res, next) => {
  const newCompany = new companyModel(req.body);
  const savedCompany = await newCompany.save();

  res.status(201).json({
    message: "Company created successfully!",
    savedCompany,
  });
});
// const createPhoto = catchAsync(async (req, res, next) => {
//   if (req.file) req.body.logo = req.file.filename;
//   let logo = "";
//   if (req.body.logo) {
//     logo = req.body.logo;
//   }

//   if (!req.body.logo) {
//     return res.status(404).json({ message: "Logo not found!" });
//   }
//   res.status(200).json({
//     message: "Photo uploaded successfully!",
//     logo: `${process.env.BASE_URL}invoices/${logo}`,
//   });
// });

const addPhotos = catchAsync(async (req, res, next) => {
  let logo = "";
  req.body.logo =
    req.files.logo &&
    req.files.logo.map(
      (file) =>
        `https://tchatpro.com/logo/${file.filename.split(" ").join("")}`
    );

  const directoryPath = path.join(logo, "uploads/logo");

  fsExtra.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      const oldPath = path.join(directoryPath, file);
      const newPath = path.join(directoryPath, file.replace(/\s+/g, ""));

      fsExtra.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error("Error renaming file: ", err);
        } 
      });
    });
  });

  if (req.body.logo) {
    logo = req.body.logo;
  }
  if(logo !== ""){
  res.status(200).json({
    message: "Photo created successfully!",
    logo,
  });
}else {
  res.status(400).json({ message: 'File upload failed.'});
}
});
const getAllCompany = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(companyModel.find(), req.query)
    .pagination()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);
  res.json({
    message: "done",
    page: ApiFeat.page,
    count: await companyModel.countDocuments(),
    results,
  });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Company was found!",
    });
  }
});

const editCompany = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedCompany = await companyModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedCompany) {
    return res.status(404).json({ message: "Company not found!" });
  }

  res.status(200).json({
    message: "Company updated successfully!",
    updatedCompany,
  });
});

const deleteCompany = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedCompany = await companyModel.findByIdAndDelete(id);

  if (!deletedCompany) {
    return res.status(404).json({ message: "Company not found!" });
  }

  res.status(200).json({ message: "Company deleted successfully!" });
});

export {
  createCompany,
  editCompany,
  deleteCompany,
  getAllCompany,
  // createPhoto,
  addPhotos,
};
