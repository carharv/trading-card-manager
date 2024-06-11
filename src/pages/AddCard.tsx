// src/pages/AddCard.tsx
import React, { useState } from "react";
import { addCard } from "../services/cardService";
import Papa from "papaparse";
import "../styles/AddCard.css";

interface FormState {
  year: string;
  player: string;
  manufacturer: string;
  cardSet: string;
  subset: string;
  type: string;
  onCardCode: string;
  sport: string;
  tags: string;
  grade: string;
  notes: string;
  pricePaid: string;
  marketPrice: string;
  duplicates: string; // New field
}

interface CsvRecord {
  Year: string;
  Manufacturer: string;
  Set: string;
  Subset: string;
  Type: string;
  "Player Name": string;
  "Card Code": string;
  Sport: string;
  Tags: string;
  Grade: string;
  "Price Paid": string;
  Quantity: string;
}

interface CsvError {
  record: CsvRecord;
  errors: { [key: string]: string };
}

const AddCard: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    year: "",
    player: "",
    manufacturer: "",
    cardSet: "",
    subset: "",
    type: "",
    onCardCode: "",
    sport: "",
    tags: "",
    grade: "",
    notes: "",
    pricePaid: "",
    marketPrice: "",
    duplicates: "1", // Default duplicates to 1
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importErrors, setImportErrors] = useState<CsvError[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (data: FormState) => {
    const newErrors: { [key: string]: string } = {};

    if (
      !data.year ||
      isNaN(Number(data.year.toString())) ||
      Number(data.year) <= 0
    ) {
      newErrors.year = "Year is required and must be a positive number";
    }
    if (!data.player) {
      newErrors.player = "Player is required";
    }
    if (!data.manufacturer) {
      newErrors.manufacturer = "Manufacturer is required";
    }
    if (!data.cardSet) {
      newErrors.cardSet = "Set is required";
    }
    if (!data.type) {
      newErrors.type = "Type is required";
    }
    if (!data.onCardCode) {
      newErrors.onCardCode = "On Card Code is required";
    }
    if (!data.sport) {
      newErrors.sport = "Sport is required";
    }
    if (
      data.pricePaid &&
      (isNaN(Number(data.pricePaid.toString())) || Number(data.pricePaid) < 0)
    ) {
      newErrors.pricePaid = "Price Paid must be a valid number";
    }
    if (
      data.marketPrice &&
      (isNaN(Number(data.marketPrice.toString())) ||
        Number(data.marketPrice) < 0)
    ) {
      newErrors.marketPrice = "Market Price must be a valid number";
    }
    if (
      data.duplicates &&
      (isNaN(Number(data.duplicates.toString())) ||
        Number(data.duplicates) <= 0)
    ) {
      newErrors.duplicates = "Duplicates must be a positive number";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(form);
    if (Object.keys(formErrors).length === 0) {
      const duplicates = parseInt(form.duplicates) || 1;
      for (let i = 0; i < duplicates; i++) {
        await addCard({
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()),
          year: parseInt(form.year),
          pricePaid: parseFloat(form.pricePaid),
          marketPrice: parseFloat(form.marketPrice),
          quantity: 1, // Set quantity to 1 by default
        });
      }
      setForm({
        year: "",
        player: "",
        manufacturer: "",
        cardSet: "",
        subset: "",
        type: "",
        onCardCode: "",
        sport: "",
        tags: "",
        grade: "",
        notes: "",
        pricePaid: "",
        marketPrice: "",
        duplicates: "1", // Reset field
      });
      setErrors({});
      setSuccessMessage("Success! Card(s) added.");
    } else {
      setErrors(formErrors);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setUploadProgress(100); // Simulate upload progress
    }
  };

  const handleFileImport = () => {
    if (csvFile) {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results: { data: CsvRecord[] }) {
          const newRecords = results.data;
          const validRecords: FormState[] = [];
          const errorsList: CsvError[] = [];

          newRecords.forEach((record, index) => {
            const parsedRecord: FormState = {
              year: record.Year,
              player: record["Player Name"],
              manufacturer: record.Manufacturer,
              cardSet: record.Set,
              subset: record.Subset,
              type: record.Type,
              onCardCode: record["Card Code"],
              sport: record.Sport,
              tags: record.Tags,
              grade: record.Grade,
              notes: "",
              pricePaid: record["Price Paid"],
              marketPrice: "",
              duplicates: "1", // Default duplicates for CSV import
            };

            const recordErrors = validateForm(parsedRecord);
            if (Object.keys(recordErrors).length === 0) {
              validRecords.push(parsedRecord);
            } else {
              errorsList.push({ record, errors: recordErrors });
            }

            // Update import progress
            setImportProgress(
              Math.floor(((index + 1) / newRecords.length) * 100)
            );
          });

          setImportErrors(errorsList);
          if (validRecords.length) {
            for (const record of validRecords) {
              const duplicates = parseInt(record.duplicates) || 1;
              for (let i = 0; i < duplicates; i++) {
                await addCard({
                  ...record,
                  tags: record.tags.split(",").map((tag) => tag.trim()),
                  year: parseInt(record.year),
                  pricePaid: parseFloat(record.pricePaid),
                  marketPrice: parseFloat(record.marketPrice),
                  quantity: 1, // Set quantity to 1 by default
                });
              }
            }
            setSuccessMessage(
              `Success! ${validRecords.length} cards imported.`
            );
          }
        },
      });
    }
  };

  return (
    <div className="add-card-container">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="add-card-form">
        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
          />
          {errors.year && <span className="error">{errors.year}</span>}
        </div>
        <div className="form-group">
          <label>Player</label>
          <input
            type="text"
            name="player"
            value={form.player}
            onChange={handleChange}
            required
          />
          {errors.player && <span className="error">{errors.player}</span>}
        </div>
        <div className="form-group">
          <label>Manufacturer</label>
          <input
            type="text"
            name="manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            required
          />
          {errors.manufacturer && (
            <span className="error">{errors.manufacturer}</span>
          )}
        </div>
        <div className="form-group">
          <label>Set</label>
          <input
            type="text"
            name="cardSet"
            value={form.cardSet}
            onChange={handleChange}
            required
          />
          {errors.cardSet && <span className="error">{errors.cardSet}</span>}
        </div>
        <div className="form-group">
          <label>Subset</label>
          <input
            type="text"
            name="subset"
            value={form.subset}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          />
          {errors.type && <span className="error">{errors.type}</span>}
        </div>
        <div className="form-group">
          <label>On Card Code</label>
          <input
            type="text"
            name="onCardCode"
            value={form.onCardCode}
            onChange={handleChange}
            required
          />
          {errors.onCardCode && (
            <span className="error">{errors.onCardCode}</span>
          )}
        </div>
        <div className="form-group">
          <label>Sport</label>
          <input
            type="text"
            name="sport"
            value={form.sport}
            onChange={handleChange}
            required
          />
          {errors.sport && <span className="error">{errors.sport}</span>}
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Grade</label>
          <input
            type="text"
            name="grade"
            value={form.grade}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Price Paid</label>
          <input
            type="number"
            step="0.01"
            name="pricePaid"
            value={form.pricePaid}
            onChange={handleChange}
          />
          {errors.pricePaid && (
            <span className="error">{errors.pricePaid}</span>
          )}
        </div>
        <div className="form-group">
          <label>Market Price</label>
          <input
            type="number"
            step="0.01"
            name="marketPrice"
            value={form.marketPrice}
            onChange={handleChange}
          />
          {errors.marketPrice && (
            <span className="error">{errors.marketPrice}</span>
          )}
        </div>
        <div className="form-group">
          <label>Total Copies</label>
          <input
            type="number"
            step="1"
            name="duplicates"
            value={form.duplicates}
            onChange={handleChange}
            required
          />
          {errors.duplicates && (
            <span className="error">{errors.duplicates}</span>
          )}
        </div>
        <button type="submit" className="submit-button">
          Add Card
        </button>
      </form>

      <div className="file-upload">
        <label>Bulk Import from File (CSV)</label>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {uploadProgress > 0 && (
          <progress value={uploadProgress} max="100">
            {uploadProgress}%
          </progress>
        )}
        <button
          onClick={handleFileImport}
          disabled={!csvFile}
          className={!csvFile ? "disabled-button" : ""}
        >
          Import File
        </button>
      </div>

      {importProgress > 0 && (
        <progress value={importProgress} max="100">
          {importProgress}%
        </progress>
      )}

      {importErrors.length > 0 && (
        <div className="import-errors">
          <h3>Records that could not be imported:</h3>
          <ul>
            {importErrors.map((error, index) => (
              <li key={index}>
                <div>Year: {error.record?.Year}</div>
                <div>Player: {error.record?.["Player Name"]}</div>
                <div>Manufacturer: {error.record?.Manufacturer}</div>
                <div>Set: {error.record?.Set}</div>
                <div>Subset: {error.record?.Subset}</div>
                <div>Type: {error.record?.Type}</div>
                <div>Card Code: {error.record?.["Card Code"]}</div>
                <div>Sport: {error.record?.Sport}</div>
                <div>Tags: {error.record?.Tags}</div>
                <div>Grade: {error.record?.Grade}</div>
                <div>Price Paid: {error.record?.["Price Paid"]}</div>
                <div>Quantity: {error.record?.Quantity}</div>
                <div>Errors:</div>
                <ul>
                  {Object.entries(error.errors).map(
                    ([field, errorMsg], idx) => (
                      <li key={idx}>
                        {field}: {errorMsg}
                      </li>
                    )
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddCard;
