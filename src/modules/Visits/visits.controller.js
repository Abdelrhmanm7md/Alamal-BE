import { visitModel } from "../../../database/models/visit.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createVisit = catchAsync(async (req, res, next) => {

  const newVisit = new visitModel(req.body);
  const savedVisit = await newVisit.save();
  res.status(201).json({
    message: "Visit created successfully!",
    savedVisit,
  });
});

const editVisit = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedVisit = await visitModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedVisit) {
    return res.status(404).json({ message: "Visit not found!" });
  }

  res.status(200).json({
    message: "Visit updated successfully!",
    updatedVisit,
  });
});

const deleteVisit = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedVisit = await visitModel.findByIdAndDelete(id);

  if (!deletedVisit) {
    return res.status(404).json({ message: "Visit not found!" });
  }

  res.status(200).json({ message: "Visit deleted successfully!" });
});

const getAllVisits = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(
    visitModel.find().populate("pharm rep driver company"),
    req.query
  )
    .pagination()
    .sort()
    .search()
    .fields();

  if (!ApiFeat) {
    return res.status(404).json({
      message: "No visits was found!",
    });
  }
  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);

  let { filterType, filterValue } = req.query;
  if(filterType&& filterValue){
    results = results.filter(function (item) {
      // if(filterType.("pharmacy")){
      if (filterType == "pharmacy") {
        return item.pharm.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "rep") {
        return item.rep.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "driver") {
        return item.driver.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "company") {
        return item.company.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "location") {
        return item.location.toLowerCase().includes(filterValue);
      }
      if (filterType == "status") {
        return item.status.toLowerCase().includes(filterValue);
      }
      if (filterType == "hasPayment") {
        return item.hasPayment.toLowerCase().includes(filterValue);
      }
    });
  }
  res.json({ message: "done", page: ApiFeat.page, results });
});

export { createVisit, editVisit, deleteVisit, getAllVisits };
