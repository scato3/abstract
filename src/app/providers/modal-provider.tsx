"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import Modal from "../components/modal";

interface ModalState {
  id: string;
  content: React.ReactNode;
  callback?: () => void;
}

interface ModalContextType {
  showModal: (content: React.ReactNode, callback?: () => void) => string;
  hideModal: (id?: string) => void;
  hideAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalState[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalIdCounterRef = useRef(0);

  useLayoutEffect(() => {
    const modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
    containerRef.current = modalRoot;

    return () => {
      if (modalRoot.parentElement) {
        modalRoot.parentElement.removeChild(modalRoot);
      }
    };
  }, []);

  const showModal = useCallback(
    (content: React.ReactNode, callback?: () => void) => {
      const id = `modal-${modalIdCounterRef.current++}`;
      setModals((prevModals) => [...prevModals, { id, content, callback }]);
      return id;
    },
    []
  );

  const hideModal = useCallback(
    (id?: string) => {
      if (id) {
        setModals((prevModals) =>
          prevModals.filter((modal) => modal.id !== id)
        );
      } else if (modals.length > 0) {
        // 아이디가 없으면 가장 마지막에 열린 모달을 닫음
        setModals((prevModals) => prevModals.slice(0, -1));
      }
    },
    [modals]
  );

  const hideAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const handleClose = useCallback(
    (id: string) => {
      const modal = modals.find((m) => m.id === id);
      hideModal(id);
      if (modal?.callback) {
        modal.callback();
      }
    },
    [hideModal, modals]
  );

  const renderModals = () => {
    if (!containerRef.current) return null;

    return modals.map((modal) =>
      createPortal(
        <Modal key={modal.id} onClose={() => handleClose(modal.id)}>
          {modal.content}
        </Modal>,
        containerRef.current as Element
      )
    );
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, hideAllModals }}>
      {children}
      {renderModals()}
    </ModalContext.Provider>
  );
}
