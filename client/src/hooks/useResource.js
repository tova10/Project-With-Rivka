import { useEffect, useRef, useState } from "react";
import { getData, addData, updateData, deleteData } from "../api/api";
import { getCache, setCache, clearResource } from "../utils/cache";

const EMPTY = { items: [], offset: 0, hasMore: false };

function buildPath(resource, query, pageSize, start) {
  let path = `${resource}${query}`;

  if (pageSize > 0) {
    const separator = query ? "&" : "?";
    path += `${separator}_start=${start}&_limit=${pageSize}`;
  }

  return path;
}

function useResource(resource, query = "", pageSize = 0) {
  const cacheKey = `${resource}${query}|${pageSize}`;

  const [data, setData] = useState(() => getCache(cacheKey) || EMPTY);
  const [loading, setLoading] = useState(() => !getCache(cacheKey));
  const [error, setError] = useState("");
  const [prevKey, setPrevKey] = useState(cacheKey);
  const [loadingMore, setLoadingMore] = useState(false);

  const dataRef = useRef(data);

  if (prevKey !== cacheKey) {
    const cached = getCache(cacheKey);
    setPrevKey(cacheKey);
    setData(cached || EMPTY);
    setLoading(!cached);
    setError("");
  }

  function apply(changes) {
    const next = { ...dataRef.current, ...changes };
    dataRef.current = next;
    setData(next);
    setCache(cacheKey, next);
  }

  useEffect(() => {
    let ignore = false;

    const cached = getCache(cacheKey);
    dataRef.current = cached || EMPTY;
    if (cached) return;

    async function load() {
      try {
        const items = await getData(buildPath(resource, query, pageSize, 0));
        if (ignore) return;
        const next = {
          items,
          offset: items.length,
          hasMore: pageSize > 0 && items.length === pageSize,
        };
        dataRef.current = next;
        setData(next);
        setCache(cacheKey, next);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [cacheKey, resource, query, pageSize]);

  async function loadMore() {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const newItems = await getData(
        buildPath(resource, query, pageSize, dataRef.current.offset)
      );
      const current = dataRef.current;
      const fresh = newItems.filter(
        (newItem) => !current.items.some((item) => item.id === newItem.id)
      );
      apply({
        items: [...current.items, ...fresh],
        offset: current.offset + newItems.length,
        hasMore: newItems.length === pageSize,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  function invalidateOthers() {
    clearResource(resource, cacheKey);
  }

  async function addItem(newItem) {
    try {
      const saved = await addData(resource, newItem);
      apply({ items: [...dataRef.current.items, saved] });
      invalidateOthers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateItem(id, changes) {
    try {
      const updated = await updateData(resource, id, changes);
      apply({
        items: dataRef.current.items.map((item) => (item.id === id ? updated : item)),
      });
      invalidateOthers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(id) {
    try {
      await deleteData(resource, id);
      const { items, offset } = dataRef.current;
      apply({
        items: items.filter((item) => item.id !== id),
        offset: pageSize > 0 ? Math.max(offset - 1, 0) : offset,
      });
      invalidateOthers();
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    items: data.items,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    loadMore,
    loadingMore,
    hasMore: data.hasMore,
  };
}

export default useResource;
