import classNames from "classnames";

type Props = {
  isLoading: boolean;
  className?: string;
};

export function LoadingModal({ isLoading, className }: Props) {
  return (
    <div className={classNames("modal", { "is-active": isLoading }, className)}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <progress className="progress is-large is-info" />
      </div>
    </div>
  );
}
