type Props = {
  isLoading: boolean;
};

export function LoadingModal({ isLoading }: Props) {
  if (!isLoading) {
    return;
  }
  return (
    <div className="modal">
      <div className="modal-background"></div>
      <div className="modal-content">
        <progress className="progress is-large is-info" />
      </div>
    </div>
  );
}
