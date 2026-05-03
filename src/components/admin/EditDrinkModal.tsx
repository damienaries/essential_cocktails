import type { Drink } from '../../types/drink'
import { Button } from '../atoms/Button'
import { Modal } from '../atoms/Modal'
import { DrinkForm } from './DrinkForm'

type Props = {
  drink: Drink
  onClose: () => void
}

export function EditDrinkModal({ drink, onClose }: Props) {
  return (
    <Modal onClose={onClose} closeOnBackdrop={false} ariaLabelledBy="edit-drink-title">
      <div className="w-full flex-[1_1_100%] min-w-0 p-4 box-border">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
          <h2 id="edit-drink-title" className="text-[var(--text-h)] text-xl m-0 text-left">
            Edit {drink.name}
          </h2>
          <Button type="button" color="primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
        <DrinkForm key={drink.id} mode="edit" drink={drink} onDone={onClose} />
      </div>
    </Modal>
  )
}
