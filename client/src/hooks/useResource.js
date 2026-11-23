import { useContext, useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../api/api";
import { CacheContext } from "../context/CacheContext";

const NO_ITEMS = [];


function buildPath(resource, query, pageSize, start) {
  if (!pageSize) return resource + query;
  return `${resource}${query}&_start=${start}&_limit=${pageSize}`;
}

function useResource(resource, query = "", pageSize = 0) {
  const { cache, saveList, changeList } = useContext(CacheContext);
  const [error, setError] = useState("");

  const key = resource + query;
  const list = cache[key];
  const isLoaded = list !== undefined;

  useEffect(() => {
    if (isLoaded) return;

    getData(buildPath(resource, query, pageSize, 0))
      .then((items) =>
        saveList(key, {
          items,
          offset: items.length,
          hasMore: pageSize > 0 && items.length === pageSize,
        })
      )
      .catch((err) => setError(err.message));
  }, [key, isLoaded, resource, query, pageSize, saveList]);

  async function loadMore() {
    try {
      const more = await getData(buildPath(resource, query, pageSize, list.offset));
      const newItems = more.filter((item) => !list.items.some((old) => old.id === item.id));
      saveList(key, {
        items: [...list.items, ...newItems],
        offset: list.offset + more.length,
        hasMore: more.length === pageSize,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function addItem(newItem) {
    try {
      const saved = await addData(resource, newItem);
      changeList(resource, key, (old) => ({ ...old, items: [...old.items, saved] }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateItem(id, changes) {
    try {
      const updated = await updateData(resource, id, changes);
      changeList(resource, key, (old) => ({
        ...old,
        items: old.items.map((item) => (item.id === id ? updated : item)),
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(id) {
    try {
      await deleteData(resource, id);
      changeList(resource, key, (old) => ({
        ...old,
        items: old.items.filter((item) => item.id !== id),
        offset: old.offset - 1,
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    items: isLoaded ? list.items : NO_ITEMS,
    loading: !isLoaded && !error,
    error,
    hasMore: isLoaded && list.hasMore,
    addItem,
    updateItem,
    removeItem,
    loadMore,
  };
}

export default useResource;