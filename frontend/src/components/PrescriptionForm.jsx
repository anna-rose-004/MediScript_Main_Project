import { useState, useEffect } from "react";
import { Pill, Trash2 } from "lucide-react";
import supabase from "../supabaseClient";

/* ------------------ Debounce Hook ------------------ */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ------------------ Prescription Form Component ------------------ */
export default function PrescriptionForm({ onChange }) {
  const [medicines, setMedicines] = useState([]);
  const [activeSearch, setActiveSearch] = useState("");
  const debouncedSearch = useDebounce(activeSearch, 300);

  const [prescribedMedicines, setPrescribedMedicines] = useState([
    { id: Date.now(), medicine_id: "", medicine_name: "", dosage: "", showSuggestions: false }
  ]);

  /* ------------------ Fetch Medicines ------------------ */
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) return;

    const fetchMedicines = async () => {
      const { data, error } = await supabase
        .from("medicine")
        .select("medicine_id, name")
        .ilike("name", `%${debouncedSearch}%`)
        .limit(10);

      if (!error) setMedicines(data || []);
      else console.error(error);
    };

    fetchMedicines();
  }, [debouncedSearch]);

  const getFilteredMedicines = (text) => {
    if (!text || text.length < 2) return [];
    const search = text.trim().toLowerCase();

    return medicines
      .filter(m => m.name && m.name.toLowerCase().includes(search))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(search);
        const bStarts = b.name.toLowerCase().startsWith(search);
        return bStarts - aStarts;
      })
      .slice(0, 10);
  };

  /* ------------------ Handlers ------------------ */
  const handleAddMedicine = () => {
    setPrescribedMedicines(prev => [
      ...prev,
      { id: Date.now(), medicine_id: "", medicine_name: "", dosage: "", showSuggestions: false }
    ]);
  };

  const handleRemove = (id) => {
    setPrescribedMedicines(prev => prev.filter(m => m.id !== id));
  };

  useEffect(() => {
    // Propagate changes to parent
    onChange && onChange(prescribedMedicines);
  }, [prescribedMedicines, onChange]);

  return (
    <div className="border p-4 rounded mb-6">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold flex gap-2"><Pill /> Prescription</h2>
        <button type="button" onClick={handleAddMedicine} className="bg-blue-600 text-white px-3 py-1 rounded">
          Add
        </button>
      </div>

      {prescribedMedicines.map(med => (
        <div key={med.id} className="bg-gray-50 p-3 rounded mb-3">
          <div className="flex justify-between mb-2">
            <strong>Medicine</strong>
            {prescribedMedicines.length > 1 && (
              <button onClick={() => handleRemove(med.id)} type="button">
                <Trash2 size={16} className="text-red-600" />
              </button>
            )}
          </div>

          {/* Medicine Search */}
          <div className="relative w-full">
            <input
              type="text"
              className="border p-2 w-full rounded"
              placeholder="Type medicine name"
              value={med.medicine_name}
              onChange={(e) => {
                const value = e.target.value;
                setPrescribedMedicines(prev =>
                  prev.map(x =>
                    x.id === med.id ? { ...x, medicine_name: value, showSuggestions: true } : x
                  )
                );
                setActiveSearch(value);
              }}
              onFocus={() => setPrescribedMedicines(prev =>
                prev.map(x => x.id === med.id ? { ...x, showSuggestions: true } : x)
              )}
              onBlur={() => setTimeout(() => setPrescribedMedicines(prev =>
                prev.map(x => x.id === med.id ? { ...x, showSuggestions: false } : x)
              ), 150)}
            />

            {med.showSuggestions && (
              <div className="absolute left-0 right-0 z-10 bg-white border rounded shadow max-h-48 overflow-y-auto">
                {getFilteredMedicines(med.medicine_name).length === 0 ? (
                  <div className="p-2 text-gray-500 text-sm">No results</div>
                ) : (
                  getFilteredMedicines(med.medicine_name).map(m => (
                    <div
                      key={m.medicine_id}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => {
                        setPrescribedMedicines(prev =>
                          prev.map(x =>
                            x.id === med.id ? { ...x, medicine_name: m.name, medicine_id: m.medicine_id, showSuggestions: false } : x
                          )
                        );
                      }}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {m.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <input
            required
            placeholder="Frequency"
            className="border p-2 w-full mt-2"
            value={med.frequency}
            onChange={e =>
              setPrescribedMedicines(prev =>
                prev.map(x => x.id === med.id ? { ...x, frequency: e.target.value } : x)
              )
            }
          />
        </div>
      ))}
    </div>
  );
}
