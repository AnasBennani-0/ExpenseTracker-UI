import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Field, FieldGroup } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, updateTransaction } from "../store/TransSlice";
import { useRef, useState, useEffect } from "react";

export default function DialogTran({ modif, clearModif }) {
  // 1. Sécurisation des données Redux
  const dbC = useSelector((st) => st.categories.dbCat);
  const safeDbC = Array.isArray(dbC) ? dbC : []; // Evite le crash .map()
  
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // Refs pour les champs non-contrôlés
  const amounttxt = useRef(null);
  const datetxt = useRef(null);
  const txtnote = useRef(null);
  const categoryRef = useRef("");
  const typeRef = useRef("expense");

  // 2. Synchronisation quand on clique sur "Modifier"
  useEffect(() => {
    if (modif) {
      setOpen(true);
      // On utilise un petit délai pour s'assurer que le DOM du Dialog est chargé
      const timer = setTimeout(() => {
        if (amounttxt.current) amounttxt.current.value = modif.amount || "";
        if (datetxt.current) datetxt.current.value = modif.date || "";
        if (txtnote.current) txtnote.current.value = modif.note || "";
        categoryRef.current = modif.category_id?.toString() || "";
        typeRef.current = modif.type || "expense";
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [modif]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation basique
    if (!categoryRef.current) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }

    const transactionData = {
      amount: parseFloat(amounttxt.current.value),
      date: datetxt.current.value,
      category_id: parseInt(categoryRef.current),
      type: typeRef.current,
      note: txtnote.current.value,
    };

    if (modif) {
      dispatch(updateTransaction({ id: modif.id, data: transactionData }));
    } else {
      dispatch(addTransaction(transactionData));
    }

    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    if (clearModif) clearModif();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val && clearModif) clearModif();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span className="text-lg">+</span> Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {modif ? "Modifier la transaction" : "Nouvelle transaction"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les champs ci-dessous pour enregistrer l'opération.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4 py-4">
            <Field>
              <Label htmlFor="amount">Montant (DH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                ref={amounttxt}
                required
                placeholder="0.00"
              />
            </Field>

            <Field>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" ref={datetxt} required />
            </Field>

            <Field>
              <Label>Catégorie</Label>
              {/* Le "key" force le composant Select à se réinitialiser avec la bonne defaultValue */}
              <Select
                key={modif ? `cat-${modif.id}` : "cat-new"}
                defaultValue={modif?.category_id?.toString()}
                onValueChange={(val) => (categoryRef.current = val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Disponibles</SelectLabel>
                    {safeDbC.length > 0 ? (
                      safeDbC.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="none">Aucune catégorie trouvée</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label>Nature</Label>
              <Select
                key={modif ? `type-${modif.id}` : "type-new"}
                defaultValue={modif?.type || "expense"}
                onValueChange={(val) => (typeRef.current = val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Dépense</SelectItem>
                  <SelectItem value="income">Revenu</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="note">Note / Description</Label>
              <Input
                id="note"
                placeholder="Ex: Courses mensuelles..."
                ref={txtnote}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="secondary" type="button">Annuler</Button>
            </DialogClose>
            <Button type="submit">
              {modif ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}