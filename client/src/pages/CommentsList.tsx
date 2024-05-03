import { Comment } from './Details';
type Props = {
  comment: Comment;
};
function CommentsList({ comment }: Props) {
  return (
    <div className="bg-white h-auto rounded-lg text-gray-700 mb-8">
      <div className="flex justify-between">
        <span className="font-bold text-xs ml-3">{comment.username}</span>
        <span className="font-bold text-xs mr-3">{comment.createdAt}</span>
      </div>
      <span className="block ml-3">{comment.message}</span>
    </div>
  );
}
export default CommentsList;
