import { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../api/api";

function useResource(resource, query = "") {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getData(`${resource}${query}`);
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [resource, query]);

  async function addItem(newItem) {
    try {
      const saved = await addData(resource, newItem);
      setItems((prev) => [...prev, saved]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateItem(id, changes) {
    try {
      const updated = await updateData(resource, id, changes);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(id) {
    try {
      await deleteData(resource, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return { items, loading, error, addItem, updateItem, removeItem };
}

export default useResource;