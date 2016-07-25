using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LMS.Domain.Helpers
{
    public static class Helpers
    {
        public static void SetMetaData(Type[] classList, Type[] metaDataList)
        {
            var lenght = classList.Length;
            if (lenght <= 0 || metaDataList.Length <= 0 || lenght != metaDataList.Length) return;

            for (int i = 0; i < lenght; i++)
            {
                SetMetaData(classList[i], metaDataList[i]);
            }
        }

        public static void SetMetaData(Type classToDecorate, Type metaData)
        {
            var provider = new AssociatedMetadataTypeTypeDescriptionProvider(classToDecorate, metaData);
            TypeDescriptor.AddProviderTransparent(provider, classToDecorate);
        }

    }
}
